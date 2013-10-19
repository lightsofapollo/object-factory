.PHONY:
test:
	./node_modules/.bin/mocha $(shell find . -name "_test.js")
