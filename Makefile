package.json:
	npm install

.PHONY:
test: package.json
	./node_modules/.bin/mocha $(shell find . -name "*_test.js")
