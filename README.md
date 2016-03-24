# wu.db.js
对集合进行 crud 操作的插件
## Usage 使用方法

### wu.db.table()
以一个数组为参数，返回一个Table类型的数组。
插件没有直接对Array进行扩展，而是创建了一个内部类Table，
Table类本身继承于数组，
所以它也是一个数组，拥有数组的所有方法并增加一些便捷的方法。
Table类型与关系型数据库的表有对应的关系。
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
table.where('id>10 && age<18').select() // 返回一个数组 [{..}, ...]
table.select('id>10 && age<18')
```
```javascript
table.select() // 返回所有 [{..}, ...]
```

### .get()
```javascript
table.where({id:10}).get() // 返回一个对象 {..}
table.get('id==10')
table.get({id:10})
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
table.save({id:10, age:25}) // 默认主键为id。若存在id等于10则更新，不存在则添加
table.save({pk:110, name:'new name'}, 'pk') // 指定主键
```

### .delete()
```javascript
table.where({id:10}).delete()
table.delete({id:10})
table.delete(10) // id字段。不是数组下标
```

### .each()
```javascript
table.each(function(item, index){
	console.log(this.id)
})
```
```javascript
table.where('id>10').each(function(item, index){
	console.log(this.id)
})
```

### .toArray()
```javascript
// Table 类本身继承于数组，
// 所以它也是一个数组，拥有数组的所有方法并增加以上的方法。
// toArray 可以返回一个原始类型的数组
table.toArray()
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
