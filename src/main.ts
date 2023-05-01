import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const {context} = github

    if (context.payload.pull_request == null) {
      core.debug(
        'This action is supposed to be run on pull_request event only.'
      )
    }

    const githubToken = core.getInput('GITHUB_TOKEN')
    const ms: string = core.getInput('milliseconds')

    const octokit = github.getOctokit(githubToken)

    const pullRequestNumber = context.payload.pull_request?.number

    if (pullRequestNumber === undefined) {
      core.debug('Could not get pull request number from context, exiting')
      return
    }

    const issue = context.issue

    octokit.rest.pulls.createReview({
      body: 'Hello from Action!',
      event: 'REQUEST_CHANGES',
      pull_number: pullRequestNumber,
      repo: issue.repo,
      owner: issue.owner
    })

    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
