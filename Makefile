install:
	npm ci

lint:
	npx eslint .

test:
	npm test

publish:
	npm publish --dry-run
