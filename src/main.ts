import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  getTouchedSourceFilesRequireTests,
  getTouchedTestFiles
} from './fileFilters'

async function run(): Promise<void> {
  try {
    const {context} = github

    const config = {
      comment:
        'Could you please add tests to make sure this change works as expected?',
      fileExtensions: ['.php', '.ts'], // todo core.getInput('fileExtensions'),
      testDir: 'tests', // todo core.getInput('testDir'),
      testPattern: '' // todo core.getInput('testPattern')
    }

    if (context.payload.pull_request == null) {
      core.debug(
        'This action is supposed to be run on pull_request event only.'
      )
    }

    const githubToken = core.getInput('GITHUB_TOKEN')

    const octokit = github.getOctokit(githubToken)
    const issue = context.issue

    const pullRequestNumber = context.payload.pull_request?.number

    if (pullRequestNumber === undefined) {
      core.debug('Could not get pull request number from context, exiting')
      return
    }

    const allFiles = await octokit.paginate(
      octokit.rest.pulls.listFiles,
      {
        owner: issue.owner,
        repo: issue.repo,
        pull_number: pullRequestNumber
      },
      res => res.data
    )

    const sourceFilesRequireTests = getTouchedSourceFilesRequireTests(
      allFiles,
      config.fileExtensions
    )

    if (sourceFilesRequireTests.length === 0) {
      core.debug('No source files require tests, exiting')
      return
    }

    const testFiles = getTouchedTestFiles(
      allFiles,
      config.testDir,
      config.testPattern
    )

    if (testFiles.length !== 0) {
      core.debug('Test files were touched, exiting')
      return
    }

    octokit.rest.pulls.createReview({
      body: 'Hello from Action!',
      event: 'REQUEST_CHANGES',
      pull_number: pullRequestNumber,
      repo: issue.repo,
      owner: issue.owner
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
