# 宝宝疫苗接种计划 - 项目上下文

## 项目简介
为2026年2月9日出生的宝宝创建的疫苗接种计划网站，包含免费疫苗（一类）和自费疫苗（二类），支持日历订阅功能。

## 线上地址
- 网站: https://baby-vaccine-plan.pages.dev
- GitHub: https://github.com/kevinckx/baby-vaccine-plan

## 技术栈
- 纯 HTML + vanilla JavaScript 单页应用
- Cloudflare Pages 静态托管 + Pages Functions（serverless）
- wrangler CLI 部署（`npx wrangler pages deploy . --project-name=baby-vaccine-plan`）
- localStorage 持久化（疫苗勾选状态、宝宝信息、自定义备注）

## 文件结构
- `index.html` — 主应用（欢迎页 + 疫苗计划页 + 日历订阅弹窗）
- `functions/api/calendar.js` — Cloudflare Pages Function，动态生成 ICS 日历文件

## 已完成功能
1. **V1**: 疫苗计划展示，免费/自费分类，价格、品牌、备注
2. **V2**: 欢迎页输入宝宝姓名+出生日期，生成个性化计划；日历下载功能
3. **V3**: 日历订阅（webcal:// 协议），替代文件下载方式
4. **备注编辑**: 用户可修改每个疫苗的备注，保存到 localStorage，同步到日历订阅
5. **订阅范围**: 全部疫苗 / 仅免费 / 仅自费 / 未接种（通过 exclude 参数传递已勾选索引）
6. **日历无地点**: 日历行程不包含 LOCATION 字段

## 疫苗数据来源
- 飞书表格导出的 CSV（`C:\Users\kaisangsang\Desktop\宝宝疫苗接种时间计划 - Sheet1.csv`）
- 五联疫苗方案（替代免费百白破+脊灰+Hib，12针减至4针）
- 关键价格: 五联 624元, 13价肺炎 626元, 五价轮状 308元, 手足口 223元, 水痘 137元

## 日历订阅 API
- 路径: `/api/calendar`
- 参数: `name`(宝宝名), `birth`(YYYY-MM-DD), `reminder`(提前天数), `scope`(all/free/paid/unchecked), `exclude`(已勾选索引), `notes`(自定义备注JSON)
- 返回: `text/calendar; charset=utf-8`
- ICS 格式要点: 行折叠（75字节限制）、CRLF 换行、无 Content-Disposition

## 已知问题与修复记录
- iOS 日历订阅验证失败: 移除了 Content-Disposition attachment、添加 ICS 行折叠、修复 UTC/本地日期混用、简化 VALARM DESCRIPTION
- Cloudflare 部署需先 `wrangler login`（OAuth 浏览器授权）

## 设计稿
- Figma: https://www.figma.com/design/itksPBphisMGGHoBIH4SVy
- Pencil: `pencil-new.pen`（3个页面: Welcome / Main / Calendar Modal）
