# Production Release Checklist

## Operational tasks
1. Coordinate with project team to decide when to make a new release of the API to production.
2. Choose a deployment time to release in advance. Due to project team availability, production releases should only be scheduled Monday-Wednesday, during morning hours. This is to accommodate any release issues during working hours, earlier in the week.
3. If there is a breaking change made to the downstream interface contract of Visitz API, release must be coordinated with a new release of the mobile app.
4. If a release will be particularly disruptive, coordinate with project team to communicate with users about the potential disruption.
5. If there were any highly visible defects at the API level, a general explanation of the fix should be added to the mobile app's release notes for its next version.

## DevOps tasks
For every deployment into dev, test or prod OpenShift environments:
1. Confirm that the latest helm chart has been sucessfully deployed via both GitHub Actions, and the OpenShift CLI / UI.
2. Confirm that a new pod has been created in the deployment and that it is running with no log errors.
3. If deploying to prod, wait for some traffic to come through to verify wotking status of APIs.
4. If deploying to dev or test, run a limited set of API calls to verify that API is connecting to upstream and working as expected.
5. If deploying to test, coordinate with project team to perform UAT.

## Technical tasks
1. Create a branch off of dev, titled 'release/v\<version number\>'. Increment the version number in helm/Chart.yaml accordingly. Use [semantic versioning](https://semver.org/).
2. Review helm description, ensuring that it is up to date.
3. Make sure dependencies, such as packages, Github actions, and Node versions are up to date with the latest [minor release](https://semver.org/).
	- Run 
		```bash
		npm audit
		```
		to check for any potential package updates that may be needed. If updates are required to Nest related packages, be sure to check the [migration guide](https://docs.nestjs.com/migration-guide) to avoid any breaking changes, as these may require code change.
4. Check the 'Security' tab on the GitHub repo to see if dependabot or code scanning has found anything that should be resolved prior to release. Note that dependabot may have found issues with dependencies already highlighted by the previous step, these will resolve once the offending packages are updated in the main branch.
5. If any package updates have been made in previous steps, run both the unit tests and the application itself locally to verify no method interfaces from imports have changed (this has happened previously).
6. Ensure all secrets are present and updated to their proper values in each environment, especially if new secrets have been added since the previous release.
7. Open a PR to dev first, titled with the version number of the release, ensuring all automated tests pass before merging.
8. Open a PR from dev to test, titled with the version number of the release, also waiting for automated tests to pass before merging. Note that deployment to this environment requires approval.
9. Open a PR from dev to main, titled with the version number of the release. Note that this PR and deployment will each require approval.
10. Tag the merge commit into main with the version number of the form v\<version number\> 
	> ex: v1.0
11. After merge to main, create a GitHub release with an auto-generated changelog. Do not create artifacts for it.
12. Inform project team that deployment is complete.
