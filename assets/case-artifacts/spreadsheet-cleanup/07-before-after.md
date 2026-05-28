# 06 表格数据清洗与异常核对 - 前后对比

## 中文

| 阶段 | 问题/状态 | 改进动作 | 判定依据 |
| --- | --- | --- | --- |
| 任务前 | 重复 order_id 可能是拆单或退款 | 只标记异常，不自动删除 | data-profile.md |
| 过程修正 | 空日期被填成当天日期 | 缺失值保持空并进入复核表 | anomalies.csv |
| 交付后 | anomalies.csv<br>original_row,field,type,value,suggestion<br>3,order_id,duplicate,1002,确认是否拆单或重复导入<br>3,amount,range,-20.00,确认是否退款<br>5,date,missing,,补充业务日期<br>5,amount,range,8500.00,人工确认大额订单 | 数据画像写清行数、列数、空值、重复和范围异常。 | data-profile.md、anomalies.csv、review-sheet.csv |

## English

| Stage | Issue / State | Improvement | Decision Basis |
| --- | --- | --- | --- |
| Before | Duplicate order_id may be split order or refund | Flag anomalies without deleting | data-profile.md |
| Correction | Blank date was filled with today | Keep blanks and put them in the review sheet | anomalies.csv |
| After | anomalies.csv<br>original_row,field,type,value,suggestion<br>3,order_id,duplicate,1002,confirm split order or duplicate import<br>3,amount,range,-20.00,confirm refund<br>5,date,missing,,add business date<br>5,amount,range,8500.00,manually confirm large order | Data profile states row count, column count, blanks, duplicates, and range anomalies. | data-profile.md, anomalies.csv, and review-sheet.csv |
