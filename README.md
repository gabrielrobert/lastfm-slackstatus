# lastfm-slackstatus


This tool allows you to take the last song in [Last.fm](last.fm) and insert it automatically into the [Slack](slack.com) status. Yes yes, as in the good old days of MSN Messenger.

## Installation

* `npm install`
* Implement your own `.env` file using the `.env.example` provided
* `tsc app.ts & up start` for developement purposes
* `up` to deploy to your AWS account

## Additional Resources

* [AWS Lambda scheduled task](https://stackoverflow.com/questions/27382009/aws-lambda-scheduled-tasks)