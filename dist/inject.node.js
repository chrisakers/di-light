module.exports = (function () {
    var resolutions = {};

    inject.resolve = store('resolve', resolve);
    inject.store = store('store', store);
    store('ref', ref);

    return inject;

    function inject(fn) {
        return fn.apply(this, Array.prototype.concat.apply([], Array.prototype.slice.call(arguments, 1)).map(resolve));
    }

    function resolve(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return isStored(str) ? retrieve(str) : store(str, ref(str));
    }

    function key(str) {
        return str.toLowerCase();
    }

    function isStored(str) {
        return key(str) in resolutions;
    }

    function retrieve(str) {
        return resolutions[key(str)];
    }

    function store(/*...aliases, value*/) {
        var aliases = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments, 0, -1)),
            value = arguments[arguments.length - 1];

        if (value !== undefined) {
            aliases.forEach(function (alias) {
                if (typeof alias === 'string') {
                    resolutions[key(alias)] = value;
                }
            });
        }
        return value;
    }

    function ref(path, base) {
        var i = path.indexOf('.');
        base = base || this;
        return (i === -1) ? base[path] : (base = base[path.substr(0, i)]) && ref(path.substr(i + 1), base);
    }
}());
