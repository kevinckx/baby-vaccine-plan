// Cloudflare Pages Function - 动态生成疫苗接种日历 (ICS)
// 订阅地址: webcal://baby-vaccine-plan.pages.dev/api/calendar?name=宝宝&birth=2026-02-09&reminder=7&scope=all

const vaccineData = [
    { age: "出生24小时内", monthOffset: 0, vaccines: [
        { name: "乙肝疫苗 1/3", type: "free", dose: "第1剂/共3剂", prevent: "乙型肝炎", brand: "深圳康泰 / 大连汉信", price: "免费", note: "出生后24小时内接种，越早越好。" },
        { name: "卡介苗", type: "free", dose: "1剂", prevent: "结核病", brand: "上海生物制品研究所", price: "免费", note: "出生后尽早接种，最迟不超过3个月。" }
    ]},
    { age: "2月龄", monthOffset: 2, vaccines: [
        { name: "乙肝疫苗 2/3", type: "free", dose: "第2剂/共3剂", prevent: "乙型肝炎", brand: "深圳康泰 / 大连汉信", price: "免费", note: "与第1剂间隔≥28天。" },
        { name: "五价轮状病毒疫苗（口服）1/3", type: "paid", dose: "第1剂/共3剂", prevent: "重度轮状病毒胃肠炎", brand: "默沙东「乐儿德」", price: "308元/剂", note: "第一针要求在84天内完成。全程3剂，保护长达7年。" },
        { name: "五联疫苗 1/4", type: "paid", dose: "第1剂/共4剂", prevent: "白喉、破伤风、百日咳、脊灰、Hib", brand: "赛诺菲巴斯德「潘太欣」", price: "624元/剂", note: "五联包含：白喉、破伤风、百日咳、脊灰、Hib。12针减至4针。" }
    ]},
    { age: "3月龄", monthOffset: 3, vaccines: [
        { name: "13价肺炎球菌疫苗 1/4", type: "paid", dose: "第1剂/共4剂", prevent: "肺炎球菌引起的肺炎、脑膜炎", brand: "辉瑞「沛儿13」/ 沃森生物", price: "626元/剂", note: "6周龄-6周岁前可接种，共4剂。强烈推荐！" },
        { name: "五联疫苗 2/4", type: "paid", dose: "第2剂/共4剂", prevent: "白喉、破伤风、百日咳、脊灰、Hib", brand: "赛诺菲巴斯德「潘太欣」", price: "624元/剂", note: "与第1剂间隔≥28天。" },
        { name: "五价轮状病毒疫苗（口服）2/3", type: "paid", dose: "第2剂/共3剂", prevent: "重度轮状病毒胃肠炎", brand: "默沙东「乐儿德」", price: "308元/剂", note: "与第1剂间隔4-10周。" }
    ]},
    { age: "4月龄", monthOffset: 4, vaccines: [
        { name: "13价肺炎球菌疫苗 2/4", type: "paid", dose: "第2剂/共4剂", prevent: "肺炎球菌疾病", brand: "辉瑞「沛儿13」/ 沃森生物", price: "626元/剂", note: "与第1剂间隔≥4周。" },
        { name: "五联疫苗 3/4", type: "paid", dose: "第3剂/共4剂", prevent: "白喉、破伤风、百日咳、脊灰、Hib", brand: "赛诺菲巴斯德「潘太欣」", price: "624元/剂", note: "基础免疫第3剂。" },
        { name: "五价轮状病毒疫苗（口服）3/3", type: "paid", dose: "第3剂/共3剂", prevent: "重度轮状病毒胃肠炎", brand: "默沙东「乐儿德」", price: "308元/剂", note: "须在32周龄前完成全部3剂。" }
    ]},
    { age: "6月龄", monthOffset: 6, vaccines: [
        { name: "乙肝疫苗 3/3", type: "free", dose: "第3剂/共3剂", prevent: "乙型肝炎", brand: "深圳康泰 / 大连汉信", price: "免费", note: "完成乙肝基础免疫全程3针。" },
        { name: "13价肺炎球菌疫苗 3/4", type: "paid", dose: "第3剂/共4剂", prevent: "肺炎球菌疾病", brand: "辉瑞「沛儿13」/ 沃森生物", price: "626元/剂", note: "基础免疫第3剂。" },
        { name: "A群流脑多糖疫苗 1/2", type: "free", dose: "第1剂/共2剂", prevent: "流行性脑脊髓膜炎", brand: "武汉生物 / 兰州生物", price: "免费", note: "也可自费选择A+C结合流脑疫苗替代（186元/剂）。" },
        { name: "A+C结合流脑疫苗 1/2（替代方案）", type: "paid", dose: "第1剂/共2剂", prevent: "A群和C群脑膜炎奈瑟菌", brand: "罗益（武汉）/ 智飞生物", price: "186元/剂", note: "与免费A群流脑二选一，保护范围更广。" },
        { name: "手足口病疫苗EV71 1/2", type: "paid", dose: "第1剂/共2剂", prevent: "EV71型手足口病", brand: "科兴生物 / 武汉生物", price: "223元/剂", note: "推荐6月龄-5岁接种。2剂间隔≥1个月。" }
    ]},
    { age: "7月龄", monthOffset: 7, vaccines: [
        { name: "手足口病疫苗EV71 2/2", type: "paid", dose: "第2剂/共2剂", prevent: "EV71型手足口病", brand: "科兴生物 / 武汉生物", price: "223元/剂", note: "与第1剂间隔≥1个月。" },
        { name: "A+C结合流脑疫苗 2/2", type: "paid", dose: "第2剂/共2剂", prevent: "A群和C群脑膜炎奈瑟菌", brand: "罗益（武汉）/ 智飞生物", price: "186元/剂", note: "如选了免费A群流脑则不需要。" }
    ]},
    { age: "8月龄", monthOffset: 8, vaccines: [
        { name: "麻腮风疫苗MMR 1/2", type: "free", dose: "第1剂/共2剂", prevent: "麻疹、腮腺炎、风疹", brand: "上海生物 / 北京科兴", price: "免费", note: "务必在满8月龄后一周内尽快完成接种！" },
        { name: "乙脑减毒活疫苗 1/2", type: "free", dose: "第1剂/共2剂", prevent: "流行性乙型脑炎", brand: "成都生物 / 武汉生物", price: "免费", note: "减毒反应大但只需2针，灭活4针安全性高。" },
        { name: "乙脑灭活疫苗（替代方案）", type: "paid", dose: "共4剂", prevent: "流行性乙型脑炎", brand: "北京科兴 / 辽宁成大", price: "244元/剂", note: "灭活与免费减毒二选一。" }
    ]},
    { age: "9月龄", monthOffset: 9, vaccines: [
        { name: "A群流脑多糖疫苗 2/2", type: "free", dose: "第2剂/共2剂", prevent: "流行性脑脊髓膜炎", brand: "武汉生物 / 兰州生物", price: "免费", note: "与第1剂间隔≥3个月。如已选A+C结合流脑则不需要。" }
    ]},
    { age: "12-15月龄", monthOffset: 12, vaccines: [
        { name: "13价肺炎球菌疫苗 4/4（加强针）", type: "paid", dose: "第4剂（加强针）", prevent: "肺炎球菌疾病", brand: "辉瑞「沛儿13」/ 沃森生物", price: "626元/剂", note: "完成13价肺炎全程4剂接种。" },
        { name: "水痘疫苗（祈健）1/2", type: "paid", dose: "第1剂/共2剂", prevent: "水痘", brand: "祈健（推荐）", price: "137元/剂", note: "强烈推荐！水痘传染性极强。" }
    ]},
    { age: "1.5-2周岁", monthOffset: 18, vaccines: [
        { name: "五联疫苗 4/4（加强针）", type: "paid", dose: "第4剂（加强针）", prevent: "白喉、破伤风、百日咳、脊灰、Hib", brand: "赛诺菲巴斯德「潘太欣」", price: "624元/剂", note: "完成五联全程4剂接种。" },
        { name: "麻腮风疫苗MMR 2/2", type: "free", dose: "第2剂/共2剂", prevent: "麻疹、腮腺炎、风疹", brand: "上海生物 / 北京科兴", price: "免费", note: "完成麻腮风全程2剂。" },
        { name: "甲肝灭活疫苗 1/2", type: "free", dose: "第1剂/共2剂", prevent: "甲型肝炎", brand: "北京科兴 / 默沙东", price: "免费", note: "灭活疫苗共2剂，保护更持久。" },
        { name: "国产一价轮状病毒疫苗 1/2", type: "paid", dose: "第1剂/共2剂", prevent: "轮状病毒腹泻", brand: "兰州生物", price: "待定", note: "1.5周岁后开始接种。" }
    ]},
    { age: "2周岁", monthOffset: 24, vaccines: [
        { name: "乙脑减毒活疫苗 2/2", type: "free", dose: "第2剂/共2剂", prevent: "流行性乙型脑炎", brand: "成都生物 / 武汉生物", price: "免费", note: "与第1剂间隔≥1年。" },
        { name: "乙脑灭活疫苗（替代方案）", type: "paid", dose: "共4剂", prevent: "流行性乙型脑炎", brand: "北京科兴 / 辽宁成大", price: "244元/剂", note: "灭活与免费减毒二选一。" },
        { name: "甲肝灭活疫苗 2/2", type: "free", dose: "第2剂/共2剂", prevent: "甲型肝炎", brand: "北京科兴 / 默沙东", price: "免费", note: "完成甲肝灭活全程2剂。" },
        { name: "霍乱疫苗", type: "paid", dose: "视情况", prevent: "霍乱", brand: "-", price: "123元", note: "暂时不打，视情况决定。" },
        { name: "国产一价轮状病毒疫苗 2/2", type: "paid", dose: "第2剂/共2剂", prevent: "轮状病毒腹泻", brand: "兰州生物", price: "待定", note: "须在3周岁前完成。" }
    ]},
    { age: "3周岁", monthOffset: 36, vaccines: [
        { name: "A+C群流脑多糖疫苗 1/2", type: "free", dose: "第1剂/共2剂", prevent: "A群和C群脑膜炎奈瑟菌", brand: "武汉生物 / 兰州生物", price: "免费", note: "3岁和6岁各1剂。" },
        { name: "水痘疫苗（祈健）2/2", type: "paid", dose: "第2剂/共2剂", prevent: "水痘", brand: "祈健（推荐）", price: "137元/剂", note: "完成水痘全程2剂接种。" }
    ]},
    { age: "6周岁", monthOffset: 72, vaccines: [
        { name: "白破疫苗（加强）", type: "free", dose: "1剂", prevent: "白喉、破伤风", brand: "武汉生物 / 长春生物", price: "免费", note: "入学前加强免疫。" },
        { name: "A+C群流脑多糖疫苗 2/2", type: "free", dose: "第2剂/共2剂", prevent: "流行性脑脊髓膜炎", brand: "武汉生物 / 兰州生物", price: "免费", note: "与第1剂间隔≥3年。" }
    ]}
];

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function toICSDate(date) {
    return date.getUTCFullYear() + pad2(date.getUTCMonth() + 1) + pad2(date.getUTCDate());
}

function escapeICS(str) {
    return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function getVaccineDate(birthDate, monthOffset) {
    const d = new Date(birthDate);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
}

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const name = url.searchParams.get('name') || '宝宝';
    const birthStr = url.searchParams.get('birth');
    const reminder = parseInt(url.searchParams.get('reminder')) || 7;
    const scope = url.searchParams.get('scope') || 'all';

    if (!birthStr || !/^\d{4}-\d{2}-\d{2}$/.test(birthStr)) {
        return new Response('Missing or invalid birth parameter (format: YYYY-MM-DD)', { status: 400 });
    }

    const [y, m, d] = birthStr.split('-').map(Number);
    const birthDate = new Date(y, m - 1, d);

    // 筛选疫苗
    let items = [];
    vaccineData.forEach(group => {
        const vDate = getVaccineDate(birthDate, group.monthOffset);
        group.vaccines.forEach(v => {
            if (scope === 'free' && v.type !== 'free') return;
            if (scope === 'paid' && v.type !== 'paid') return;
            items.push({ ...v, date: vDate, age: group.age });
        });
    });

    // 生成当前时间戳
    const now = new Date();
    const stamp = now.getUTCFullYear() + pad2(now.getUTCMonth()+1) + pad2(now.getUTCDate()) + 'T' +
                  pad2(now.getUTCHours()) + pad2(now.getUTCMinutes()) + pad2(now.getUTCSeconds()) + 'Z';

    let lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BabyVaccinePlan//CN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${escapeICS(name)}的疫苗接种计划`,
        'X-WR-TIMEZONE:Asia/Shanghai',
        // 刷新间隔：每天刷新一次
        'REFRESH-INTERVAL;VALUE=DURATION:P1D',
        'X-PUBLISHED-TTL:P1D'
    ];

    items.forEach((it, idx) => {
        const endDate = new Date(it.date);
        endDate.setDate(endDate.getDate() + 1);

        const desc = [
            `疫苗: ${it.name}`,
            `预防: ${it.prevent}`,
            `剂次: ${it.dose}`,
            `类型: ${it.type === 'free' ? '免费（一类）' : '自费（二类）'}`,
            `价格: ${it.price}`,
            `品牌: ${it.brand}`,
            `备注: ${it.note}`
        ].join('\\n');

        const uid = `vaccine-${birthStr}-${idx}@baby-vaccine-plan`;

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${stamp}`);
        lines.push(`DTSTART;VALUE=DATE:${toICSDate(it.date)}`);
        lines.push(`DTEND;VALUE=DATE:${toICSDate(endDate)}`);
        lines.push(`SUMMARY:💉 ${escapeICS(name)} - ${escapeICS(it.name)}`);
        lines.push(`DESCRIPTION:${escapeICS(desc)}`);
        lines.push('LOCATION:社区卫生服务中心');
        // 提前 N 天提醒
        lines.push('BEGIN:VALARM');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:${escapeICS(name)}的疫苗接种提醒: ${escapeICS(it.name)}`);
        lines.push(`TRIGGER:-P${reminder}D`);
        lines.push('END:VALARM');
        // 当天早上提醒
        lines.push('BEGIN:VALARM');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:今天要带${escapeICS(name)}去接种: ${escapeICS(it.name)}`);
        lines.push('TRIGGER:-PT2H');
        lines.push('END:VALARM');
        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n');

    return new Response(icsContent, {
        headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}的疫苗计划.ics"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
