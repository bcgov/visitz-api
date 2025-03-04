# Contributing

## Merging and Pull Requests

1. App secrets MUST NOT be committed. Use configuration files and/or environment variables instead. Pull Requests containing info that must not be committed will be rejected.

    Before making a new PR, you must:

    1. Close the PR (if it isn't already)

    2. Delete your working branch from remote

    3. Rebase your local commit history to remove the offending content

    4. Push the modified branch to remote and create a new PR

2. Environment-specific config values MUST NOT be commited to the repository. Use GitHub Actions and string replace/interpolation with variables/secrets instead.

3. To update your working branch from a remote branch, rebase it onto the remote branch. You MUST NOT merge remote branches into your working branch for the purpose of updating them.

    * This keeps the commit history cleaner and Pull Requests won't be littered with changes unrelated to your new work.

4. You MUST create a Merge Commit when merging a Pull Request.

    * Avoid the *Rebase and Merge* option when merging a Pull Request. Instead, rebase your feature branch, push, then run a normal merge.

5. Before merging a branch into one of the mainlines (dev, test, main) you MUST remove all instances of commented code.

    * If you're temporarily disabling code then this isn't something that should be merged into the main branches.

    * If it's for some kind of A/B testing, then enabling/disabling certain features can be handled by active code instead of manually building different snapshots with commented code.

    * Disabling code but keeping it in comments for historical purposes: remove it, Git keeps it for us.

## Coding Conventions

Follow [MDN Guidelines for writing JavaScript (code examples)](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript) and/or the JavaScript linter set up in the project.

Then:

1. Maximum line length is 120 characters.

    * If possible, set this in your text editor ([VSCode](https://stackoverflow.com/a/60060509))

    * Try to break lines starting from 80 characters if it visually makes sense, but don't force it.

2. If a function is becoming unwieldy and large, consider refactoring it into private functions ([Headlines technique](http://wiki.c2.com/?HeadlinesTechnique)) that completes smaller tasks with descriptive names.

3. Avoid writing comments if you can. Instead, rely on the Headlines technique with concise-yet-descriptive function names. If you must write a comment, write the "why" rather than "what" or "how".

    > "Must write a comment": describing a bug or workaround behaviour

4. Ternary statements MUST NOT be nested.

    * Refactor the surrounding code to work without a nested ternary statement (try the Headlines technique!).

    * If a ternary statement is too long, consider refactoring or breaking them up with whitespace:

        ```C#
        return someBoolValue
                ? BigStringUtilities.DoSomeLargeAmountsOfProcessing(someStringValue)
                : SmallerStringUtilities.TrimSomeWhitespace(someStringValue);
        ```
