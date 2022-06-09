export const db = require("better-sqlite3")("./data.db", {
  verbose: console.log,
});

const dbAdd = (db, table, data) => {
  if(data.id){
    db.prepare(`DELETE FROM ${table} where id = $id`).run(data);
  }
  const cols = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map((x) => "$" + x)
    .join(", ");
  const stmt = db.prepare(
    `INSERT INTO ${table} (` + cols + `) VALUES (` + placeholders + `)`
  );
  stmt.run(data);
};

export const insert = (table: string, data: any[]) => {
  for (const item of data) {
    dbAdd(db, table, item);
  }
};

/**
 *
 * 在此处建新表直接建表语句建，修改字段在表后面加字段，不要再原来的基础上修改可能会导致升级失败
 *
 */

// 属性
db.exec(`
create table if not exists m_dimdef(
"id" INT PRIMARY KEY,
"dimflag" char(80),
"name" char(80),
"description" char(300),
"creationdate" INT,
"modifieddate" INT
);`);

// 属性值
db.exec(`
create table if not exists m_dim(
"id" INT PRIMARY KEY,
"m_dimdef_id" INT,
"attribcode" char(80),
"attribname" char(80),
"dimflag" char(80),
"creationdate" INT,
"modifieddate" INT
);`);

// ASI
db.exec(`
create table if not exists m_attributesetinstance(
"id" INT PRIMARY KEY,
"value1_id" INT,
"value2_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

// 尺寸组
db.exec(`
create table if not exists m_attribute(
"id" INT PRIMARY KEY,
"name" char(80),
"clrsize" INT,
"description" char(200),
"creationdate" INT,
"modifieddate" INT
);`);

// 颜色尺码
db.exec(`
create table if not exists m_attributevalue(
"id" INT PRIMARY KEY,
"value" char(80),
"name" char(80),
"martixcol" INT,
"clrsize" INT,
"m_attribute_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

// 商品
db.exec(`
create table if not exists m_product(
"id" INT PRIMARY KEY,
"name" char(80),
"value" char(80),
"serialno" char(80),
"imageurl" char(200),
"m_sizegroup_id" INT,
"m_dim1_id" INT,
"m_dim2_id" INT,
"m_dim3_id" INT,
"m_dim4_id" INT,
"m_dim5_id" INT,
"m_dim6_id" INT,
"m_dim7_id" INT,
"m_dim8_id" INT,
"m_dim9_id" INT,
"m_dim10_id" INT,
"m_dim11_id" INT,
"m_dim12_id" INT,
"m_dim13_id" INT,
"m_dim14_id" INT,
"m_dim15_id" INT,
"m_dim16_id" INT,
"m_dim17_id" INT,
"m_dim18_id" INT,
"m_dim19_id" INT,
"m_dim20_id" INT,
"m_dim21_id" INT,
"pricelist" DECIMAL(14,2),
"precost" DECIMAL(14,2),
"pricelist2" DECIMAL(14,2),
"creationdate" INT,
"modifieddate" INT
);`);

// 条码
db.exec(`
create table if not exists m_product_alias(
"id" INT PRIMARY KEY,
"no" char(80),
"intscode" char(80),
"m_product_id" INT,
"m_attributesetinstance_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

// 会员类型
db.exec(`
create table if not exists c_viptype(
"id" INT PRIMARY KEY,
"code" char(80),
"name" char(80),
"c_viptypeup_id" INT,
"discount" DECIMAL(14,2),
"rediscount" DECIMAL(14,2),
"creationdate" INT,
"modifieddate" INT
);`);

// 会员类型折扣,对应属性
db.exec(`
create table if not exists c_viptype_dis(
"id" INT PRIMARY KEY,
"c_viptype_id" INT,
"m_dim_id" INT,
"discount" DECIMAL(14,2),
"rediscount" DECIMAL(14,2),
"creationdate" INT,
"modifieddate" INT
);`);

// 员工
db.exec(`
create table if not exists hr_employee(
"id" INT PRIMARY KEY,
"no" char(80),
"name" char(80),
"creationdate" INT,
"modifieddate" INT
);`);

// POS零售单
db.exec(`
create table if not exists pos_retail(
"id" char(80),
"retail_json" char(80),
"is_hang" INT2 default 0,                                                           
"is_pay" INT2 default 0,
"is_push" INT2 default 0,
"creationdate" INT default (datetime('now', 'localtime')),
"modifieddate" INT default (datetime('now', 'localtime'))
);`);

// 获取最大修改时间
export function getLastModifidDate(table) {
  return db
    .prepare(`SELECT datetime(max(modifieddate)) as mdate FROM ${table}`)
    .get()?.mdate;
}

export const queryProductKeyWordSql = `
select t.*
from (
  select id as "id", no as "code",  'sku' as "type"
  from m_product_alias
  union all
  select id, name, 'spu'
  from m_product
) t
where t.code = ?
      `;

export const queryProductKeyWordLikeSql = `
select t.*
from (
  select a.id as "id", a.no as "code",  'sku' as "type", p.value as "name"
  from m_product_alias a, m_product p
  where a.m_product_id = p.id
  union all
  select id, name, 'spu', value
  from m_product
) t
where t.code like ? || '%'
      `;
export const queryProductByIdSql = `
                SELECT *
          FROM m_product
          WHERE id = ?
      `;

export const queryProductAttributesSql = `
SELECT attv.id AS "id", 1 as "type", attv.name AS "name", attv.value AS "code", attv.martixcol as "sort"
FROM m_attributevalue attv
WHERE EXISTS(SELECT 1
             FROM m_product_alias t,
                  m_attributesetinstance attr
             WHERE t.m_product_id = @id
               AND attr.value1_id = attv.id
               AND attr.id = t.m_attributesetinstance_id)
UNION ALL
SELECT attv.id AS "id", 2 as "type", attv.name AS "name", attv.value AS "code", attv.martixcol as "sort"
FROM m_attributevalue attv
WHERE EXISTS(SELECT 1
             FROM m_product_alias t,
                  m_attributesetinstance attr
             WHERE t.m_product_id = @id
               AND attr.value2_id = attv.id
               AND attr.id = t.m_attributesetinstance_id)
      `;

export const queryProductSkuSql = `
select t.id           as "id",
       t.no           as "no",
       attr.value1_id as "colorId",
       attr.VALUE2_ID as "sizeId"
from M_PRODUCT_ALIAS t,
    m_product pdt,
    m_attributesetinstance attr
where t.M_PRODUCT_ID = pdt.id
  and t.M_ATTRIBUTESETINSTANCE_ID = attr.id
  and pdt.id = ?
      `;

export const queryProductDimsSql = `
select t.attribcode as "value" , t.dimflag  as "code"
from m_dim t, (select x.m_dim1_id, x.m_dim2_id, x.m_dim3_id, x.m_dim4_id, x.m_dim5_id, x.m_dim6_id, x.m_dim7_id, x.m_dim8_id, x.m_dim9_id, x.m_dim10_id,m_dim11_id, x.m_dim12_id, x.m_dim13_id, x.m_dim14_id, x.m_dim15_id, x.m_dim16_id, x.m_dim17_id, x.m_dim18_id, x.m_dim19_id, x.m_dim20_id, x.m_dim21_id
  from m_product x, m_product_alias a
  where x.id = a.m_product_id
  and a.no = ?) p
where t.id in (p.m_dim1_id, p.m_dim2_id, p.m_dim3_id, p.m_dim4_id, p.m_dim5_id, p.m_dim6_id, p.m_dim7_id, p.m_dim8_id, p.m_dim9_id, p.m_dim10_id,m_dim11_id, p.m_dim12_id, p.m_dim13_id, p.m_dim14_id, p.m_dim15_id, p.m_dim16_id, p.m_dim17_id, p.m_dim18_id, p.m_dim19_id, p.m_dim20_id, p.m_dim21_id
)      
      `;

export const querySkuFull = `
      SELECT mpa.id, mpa.no as "skuCode", mp.name as "spuCode", mp.value as "spuName", mp.pricelist as price, clr.name || '(' ||clr.value ||')' as color, sz.name || '(' ||sz.value ||')' as size
FROM m_product_alias mpa , m_product mp , m_attributesetinstance ma , m_attributevalue clr, m_attributevalue sz
where mpa.m_product_id  = mp.id 
and mpa.m_attributesetinstance_id = ma.id 
and ma.value1_id = clr.id 
and ma.value2_id = sz.id
and mpa.no = ?
      `;

export const queryMarketDim = `
SELECT mpa.id, mpa.no as "skuCode", clr.name as colorName, clr.value as colorCode, sz.name as sizeName, sz.value as sizeCode
FROM m_product_alias mpa, m_attributesetinstance ma , m_attributevalue clr, m_attributevalue sz
WHERE mpa.m_attributesetinstance_id = ma.id 
AND ma.value1_id = clr.id 
AND ma.value2_id = sz.id
AND mpa.no = ?
`