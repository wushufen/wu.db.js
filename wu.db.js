/*!
 * 使用方法
 * https://github.com/wusfen/wu.db.js
 */
var wu = wu || {};
(function() {

    function Table(arr) {
        if (!(this instanceof Table)) {
            return new Table(arr);
        }
        [].splice.apply(this, [0, 0].concat(arr || []));
    }
    Table.prototype = [];
    Table.prototype.constructor = Table;
    var pro = {
        where: function(_w) {
            this.where._w = _w;
            return this;
        },
        select: function(_w, isOne) {
            _w = _w || this.where._w;

            var findArr = [];
            for (var i = 0; i < this.length; i++) {
                var row = this[i];

                var eq = true;
                if (typeof _w == 'string') {
                    // where('id>=3 && ... || ...')
                    with(row) {
                        eq = eval(_w);
                    }
                } else {
                    for (var key in _w) {
                        if (row[key] != _w[key]) { // 不全等
                            eq = false;
                        }
                    }
                }

                if (eq) {
                    findArr.push(row);
                    if (isOne) {
                        break
                    }
                }
            }

            delete this.where._w;

            return findArr;
        },
        get: function(_w) {
            if (!isNaN(+_w)) {
                _w = { id: _w };
            }
            return this.select(_w, true)[0];
        },
        set: function(obj) {
            var rs = this.select(this.where._w);
            for (var i = 0; i < rs.length; i++) {
                var row = rs[i];
                for (var key in obj) {
                    row[key] = obj[key];
                }
            }
            return rs;
        },
        save: function(obj, pk) {
            pk = pk || 'id';
            if (pk in Object(obj)) {
                var kv = {};
                kv[pk] = obj[pk];
                var findObj = this.get(kv);
                if (findObj) {
                    for (var key in obj) {
                        findObj[key] = obj[key];
                    }
                    return this;
                }
            }

            this.push(obj);
            return this;
        },
        delete: function(_w) {
            if (!isNaN(+_w)) {
                _w = { id: _w };
            }
            var findArr = this.select(_w);
            for (var i = 0; i < findArr.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (findArr[i] == this[j]) {
                        this.splice(j--, 1);
                    }
                }
            }
            return this;
        },
        each: function(fn) {
            var rs = this.select(this.where._w);
            for (var i = 0; i < rs.length; i++) {
                fn.call(rs[i], rs[i], i);
            }
            return this;
        },
        toArray: function() {
            return this.slice();
        }
    };

    function extend(a, b) {
        for (var i in b) {
            a[i] = b[i];
        }
        return a;
    }
    extend(Table.prototype, pro);

    wu.db = function(obj) {
        function DB(obj) {
            for (var i in obj) {
                this[i] = Table(obj[i]);
            }
        };
        DB.prototype.table = function(name) {
            if (!this[name]) {
                this[name] = Table();
            }
            return this[name];
        };
        return new DB(obj || {});
    };
    wu.db.table = function(arr) {
        return Table(arr);
    };
    wu.db.Table = Table;

})();
