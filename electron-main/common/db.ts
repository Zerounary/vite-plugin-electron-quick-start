export const db = require("better-sqlite3")("./data.db", {
  verbose: console.log,
});

export interface DimDef {
  id: number;
  name: string;
  description: string;
  dimflag: string;
}
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

export const insert_m_dimdef = db.prepare(
  `INSERT INTO m_dimdef VALUES (@id, @dimflag, @name, @description, @creationdate, @modifieddate)`
);

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

export const insert_m_dim = db.prepare(
  `INSERT INTO m_dim VALUES (@id, @m_dimdef_id, @attribcode, @attribname, @dimflag, @creationdate, @modifieddate)`
);

// ASI
db.exec(`
create table if not exists m_attributesetinstance(
"id" INT PRIMARY KEY,
"value" char(80),
"name" char(80),
"martixcol" INT,
"value1_id" INT,
"value2_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

export const insert_m_attributesetinstance = db.prepare(
  `INSERT INTO m_attributesetinstance VALUES (@id, @value, @name, @martixcol, @value1_id, @value2_id, @creationdate, @modifieddate)`
);

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

export const insert_m_attribute = db.prepare(
  `INSERT INTO m_attribute VALUES (@id, @name, @clrsize, @description, @creationdate, @modifieddate)`
);

// 颜色尺码
db.exec(`
create table if not exists m_attributevalue(
"id" INT PRIMARY KEY,
"value" char(80),
"name" char(80),
"clrsize" INT,
"m_attribute_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

export const insert_m_attributevalue = db.prepare(
  `INSERT INTO m_attributevalue VALUES (@id, @value, @name, @clrsize, @m_attribute_id, @creationdate, @modifieddate)`
);

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

export const insert_m_product = db.prepare(
  `INSERT
	INTO
	m_product
VALUES (@id,
@name,
@value,
@serialno,
@imageurl,
@m_sizegroup_id,
@m_dim1_id,
@m_dim2_id,
@m_dim3_id,
@m_dim4_id,
@m_dim5_id,
@m_dim6_id,
@m_dim7_id,
@m_dim8_id,
@m_dim9_id,
@m_dim10_id,
@m_dim11_id,
@m_dim12_id,
@m_dim13_id,
@m_dim14_id,
@m_dim15_id,
@m_dim16_id,
@m_dim17_id,
@m_dim18_id,
@m_dim19_id,
@m_dim20_id,
@m_dim21_id,
@pricelist,
@precost,
@pricelist2,
@creationdate,
@modifieddate)`
);

// 条码
db.exec(`
create table if not exists m_product_alias(
"id" INT PRIMARY KEY,
"no" char(80),
"intscode" char(80),
"m_attributesetinstance_id" INT,
"creationdate" INT,
"modifieddate" INT
);`);

export const insert_m_product_alias = db.prepare(
  `INSERT INTO m_product_alias VALUES (@id, @no, @intscode, @m_attributesetinstance_id, @creationdate, @modifieddate)`
);

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

export const insert_c_viptype = db.prepare(
  `INSERT INTO c_viptype VALUES (@id, @code, @name, @c_viptypeup_id, @discount, @rediscount, @creationdate, @modifieddate)`
);

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
export const insert_c_viptype_dis = db.prepare(
  `INSERT INTO c_viptype_dis VALUES (@id, @c_viptype_id, @m_dim_id, @discount, @rediscount, @creationdate, @modifieddate)`
);
