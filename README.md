# wu.db.js
对集合进行 crud 操作的插件
## Usage 使用方法

### .table()
```javascript
var userList = [...];
var table = wu.db.table(userList)
```

### .where()
```javascript
table.where('id>10 && age<18').select()
```
```javascript
table.where({id:10}).get()
```

### .select()
```javascript
table.select('id>10 && age<18') // [{..}, ...]
table.where('id>10 && age<18').select()
```
```javascript
table.select() // 返回所有 [{..}, ...]
```

### .get()
```javascript
table.get('id==10') // {..}
table.get({id:10})
table.where({id:10}).get()
table.get(10) // id字段可以直接这样写
```
```javascript
table.get() // 返回第一个 {..}
```

### .set()
```javascript
table.where({id:10}).set({age:20})
```

### .save()
```javascript
table.save({id:10, age:25}) // 默认主键为id。若存在10等于10则更新，不存在则添加
table.save({pk:110, name:'new name'}, 'pk') // 指定主键
```

### wu.db().table()
```javascript
var data = {
  goods: [...],
  attr: [...]
};
```
```javascript
var db = wu.db(data);
```
```javascript
var table = db.table('goods'); // 如果不存在会自动创建
var obj = table.get({id:10});
```
```javascript
var obj = db.goods.get({name:'xxx'});
```
```javascript
wu.db(data).table('goods').where('id>10').select();
wu.db(data).goods.where('id>10').select();
```
