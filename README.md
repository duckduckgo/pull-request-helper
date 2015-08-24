# DDG Pull Request Helper

This is a simple tool that helps you create ordered, organized lists of example queries for several Instant Answers.

## Setup

- run once: `npm install` to install the required node\_modules
- run once: `bower install` to install bower components

## Usage

- run `grunt wget` to pull down the latest Instant Answer Metadata
- run `grunt server` to serve the file on port **5000**
- goto http://localhost:5000/
- search by ID for the Instant Answer you want to add, hit "Enter" to choose from the autocomplete list
- the selected Instant Answer will be added to the markdown text below
- repeat selecting as many IA's as you want
    - **Note**: The markdown is recreated as each new IA is added. Any changes you make to the markdown will be erased!
- copy the generated markdown into a Github PR

## Questions, Comments, Concerns?

Contact Zaahir (moollaza@duckduckgo.com)
