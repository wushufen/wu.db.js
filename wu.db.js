
/*
wu.db().table(arr)
db = {
	goods: [...],
	attr: [...]
}
wu.db(db).table('work') // 不存在会创建
wu.db(db).table('work').where({id:1}).select()
wu.db(db).table('work').select({id:1}) // => [{..},...]
wu.db(db).table('work').select() // => 返回全部
wu.db(db).table('work').get({id:1}) // => {..}
wu.db(db).table('work').where().get() // => 返回第一个{..}
wu.db(db).table('work').where({id:1}).set({name:'new name'})
wu.db(db).table('work').save({name:'afwf'}).sync()

db = wu.db(data.db)
db = {
    "goods": {
        arr: data.db.goods,
        select: select,
        get: get,
    },
    "sku": {
        arr: data.db.sku,
        "...": "..."
    }
}

db.goods.select();
db.goods.get(id).src;
db.goods.where('id>10 && id<20').select();

wu.db.table(data.db.goods);
 */



(function(global) {
    function clone(obj) {
        var obj2 = {};
        for (var key in obj) {
            obj2[key] = obj[key];
        }
        return obj2;
    }

    function select(arr, obj, isOne) {
        obj = obj || this._where;

        var findArr = [];
        for (var i = 0; i < arr.length; i++) {
            var row = arr[i];

            var eq = true;
            if (typeof obj == 'string') {
                // where('id>=3 && ... || ...')
                with(row) {
                    eq = eval(obj);
                }
            } else {
                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    if (row[key] != obj[key]) { // 不全等
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

        return findArr;
    }

    function get(arr, obj) {
        if (!isNaN(+obj)) {
            obj = { id: obj };
        }
        return select.call(this, arr, obj, true)[0]; // call chain this
    }

    function set(arr, obj) {
        var rs = select.call(this, arr, this._where);

        for (var i = 0; i < rs.length; i++) {
            var row = rs[i];
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                row[key] = obj[key];
            }
        }

        return rs;
    }

    function where(obj) {
        // clone 确保同一表达式不同次使用的 this 的引用不一样
        // 因为 _where 参数用 this 来传递
        // 如果 this 的引用一样，_where 会被其它的改变
        // 导致结果不对
        var c = clone(this);
        c._where = obj;
        return c;
    }

    // todo...
    function orderBy(name, desc) {
        var c = clone(this);
        c._orderBy = name;
        c._desc = desc;
        return c;
    }

    function save(arr, obj, pk) {
        pk = pk || 'id';
        if (pk in obj) {
            var kv = {};
            kv[pk] = obj[pk];
            var findObj = get.call(this, arr, kv);
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                findObj[key] = obj[key];
            }
        } else {
            arr.push(obj);
        }
        return arr;
    }

    function table(dbObj, nameOrArr, arr) {
        if (nameOrArr == 'table') {
            // 与 table 方法同名的表改与 _table
            nameOrArr = '_table';
        }
        // 已存在即返回
        if (dbObj[nameOrArr]) {
            return dbObj[nameOrArr];
        }
        // 不存在V

        // 包装
        var Table = {
            arr: nameOrArr, // 如果 nameOrArr 是数组，则包装的是该数组
            select: function(obj) {
                return select.call(this, this.arr, obj);
            },
            get: function(obj) {
                return get.call(this, this.arr, obj);
            },
            where: where,
            save: function(obj, pk) {
                return save.call(this, this.arr, obj, pk);
            },
            set: function(obj) {
                return set.call(this, this.arr, obj);
            }
        };

        // 如果 nameOrArr 是表名，则包装一个新数组或使用传来的 arr
        if (typeof nameOrArr == 'string') {
            Table.arr = arr || [];
            dbObj[nameOrArr] = Table;
        }

        return Table;
    }

    // api
    global.wu = global.wu || {};
    wu.db = function(obj) {
        wu.db.obj = {
            table: function(nameOrArr) {
                return table(wu.db.obj, nameOrArr);
            }
        };
        for (var key in obj) {
            table(wu.db.obj, key, obj[key]);
        }
        return wu.db.obj;
    };
    wu.db.table = function(arr) {
        return table({}, arr);
    };

})(this);
