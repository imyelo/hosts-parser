node_modules:
	npm install

test: node_modules
	./node_modules/.bin/mocha

.PHONY: test
