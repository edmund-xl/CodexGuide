# 06 表格数据清洗与异常核对 - 结果片段

## 中文

```text
anomalies.csv
original_row,field,type,value,suggestion
3,order_id,duplicate,1002,确认是否拆单或重复导入
3,amount,range,-20.00,确认是否退款
5,date,missing,,补充业务日期
5,amount,range,8500.00,人工确认大额订单
```

## English

```text
anomalies.csv
original_row,field,type,value,suggestion
3,order_id,duplicate,1002,confirm split order or duplicate import
3,amount,range,-20.00,confirm refund
5,date,missing,,add business date
5,amount,range,8500.00,manually confirm large order
```
