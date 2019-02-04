function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

