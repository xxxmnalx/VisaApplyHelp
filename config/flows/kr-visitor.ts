import type { FlowConfig, FlowStep, FlowTask } from "@/lib/flow-types";
import type { SupportedIdentityCode } from "@/config/identities";

const EMB_KR = "韩国驻美国大使馆";
const CG_NY = "韩国驻纽约总领事馆";
const CG_SF = "韩国驻旧金山总领事馆";
const CG_LA = "韩国驻洛杉矶总领事馆";
const CG_HOU = "韩国驻休斯敦总领事馆";
const MOJ_VISA = "韩国法务部 Korea Visa Portal";
const KETA = "韩国法务部出入境管理局 K-ETA";
const CBP = "美国海关与边境保护局（CBP）";
const SEVP = "美国 SEVP / 国土安全部（DHS）";
const USCIS = "美国公民及移民服务局（USCIS）";
const PIAODI = "北美票帝 piao.tips（第三方经验，非官方）";

/** 身份差异集中在这里：文案与在美身份证明材料按身份切换，其余步骤共享。 */
type IdentityVariant = {
  statusSlug: string;
  statusLabel: string;
  audience: string;
  /** 「准备材料」步中证明在美身份的材料任务。 */
  statusProofTasks: FlowTask[];
};

const identityVariants: Record<SupportedIdentityCode, IdentityVariant> = {
  F1: {
    statusSlug: "f1",
    statusLabel: "F-1 在读学生",
    audience:
      "持中国普通护照、年满 18 岁、目前以 F-1 身份在美国学习、计划赴韩短期观光或访问的申请人",
    statusProofTasks: [
      {
        id: "i20-proof",
        title: "有效 I-20（原件及复印件）",
        kind: "required",
        description:
          "官方要求。韩国领馆把有效 I-20 列为可接受的在美合法长期居留证明；邮寄申请时按领馆要求可能需公证复印件。",
        sourceIds: ["ny-c39", "i20-info"],
      },
      {
        id: "f1-extra",
        title: "签证页 / I-94 复印件与在读证明",
        kind: "recommended",
        description:
          "本站建议（第三方经验）。另备美签页与 I-94 复印件、在读证明更稳妥；旅费由父母资助的，可加父母资金证明与关系证明。",
        sourceIds: ["cbp-i94", "piaodi-kr"],
      },
    ],
  },
  H1B: {
    statusSlug: "h1b",
    statusLabel: "H-1B 工作身份",
    audience:
      "持中国普通护照、年满 18 岁、目前以 H-1B 身份在美国工作、计划赴韩短期观光或访问的申请人",
    statusProofTasks: [
      {
        id: "i797-proof",
        title: "有效 I-797 批准通知（原件及复印件）",
        kind: "required",
        description:
          "官方要求。韩国领馆把有效 I-797 批准通知列为可接受的在美合法长期居留证明；邮寄申请时按领馆要求可能需公证复印件。",
        sourceIds: ["ny-c39", "uscis-i797"],
      },
      {
        id: "h1b-extra",
        title: "近期工资单与在职信",
        kind: "recommended",
        description:
          "本站建议（第三方经验）。近 2–3 个月工资单与在职信可同时佐证身份与资金状况，备上更稳妥；美签贴纸过期但身份有效的情形无官方明文，建议先向管辖领馆确认。",
        sourceIds: ["cbp-i94", "piaodi-kr"],
      },
    ],
  },
};

function buildSteps(variant: IdentityVariant): FlowStep[] {
  return [
    {
      id: "overview",
      slug: "overview",
      title: "确认需要签证与申请资格",
      milestone: "确认资格",
      summary:
        "中国大陆护照不能用 K-ETA、对华团体免签也不适用从美国出发的个人——先确认你需要 C-3 签证、有资格在美申请，再开始。",
      officialLinkIds: ["keta", "ny-c39", "visa-portal"],
      showSummaryPanel: true,
      showEtaEstimator: true,
      tasks: [
        {
          id: "common-sense",
          title: "我已确认基本条件（一次勾选即可）",
          kind: "required",
          description:
            "本站不审核你的申请，这些条件多数人都满足、自己心里有数即可；展开可查看具体包含哪些。",
          detailPoints: [
            "访问目的为短期观光 / 探访，结束后按时离开韩国并返回美国。",
            "护照有效期剩余 6 个月以上，并用同一本护照申请与旅行。",
            "有明确的旅行计划（机票与住宿安排建议提前准备）。",
            "能负担申请与旅行费用。",
            "没有需要专业协助的犯罪、移民或健康复杂情况；虚假陈述或伪造文件会被直接拒签并影响未来申请（纽约总领馆官方警告）。",
          ],
          sourceIds: ["ny-c39"],
        },
        {
          id: "need-visa",
          title: "确认你需要办签证：K-ETA 与「对华免签」都不适用",
          kind: "required",
          description:
            "官方口径。K-ETA 仅面向免签国家国民，中国大陆普通护照不能申请；新闻里的「对华团体免签」仅限在中国境内经指定旅行社组团，从美国出发的个人不适用。美韩往返旅游必须申请 C-3 签证。",
          sourceIds: ["keta", "ny-c39"],
        },
        {
          id: "transit-b2",
          title: "行程是中转？先核对过境免签 B-2（可省去办签）",
          kind: "conditional",
          description:
            "视情况。若行程是「美国→韩国→中国」或「中国→韩国→美国」这类经韩国前往第三目的地 / 国籍国的中转，持有效美签或绿卡并有 30 天内离境机票，可免签停留最多 30 天、无需办 C-3；美国→韩国→美国的纯往返不适用。",
          detailPoints: [
            "须持有效的美国（含关岛 / 塞班）、加拿大、澳大利亚、新西兰或 32 个欧洲国家签证 / 永居。",
            "入境韩国前在第三国中转停留不得超过 3 天；3 年内曾被韩国拒绝入境或遣返者不适用。",
            "免签入境由边检最终裁量，没把握时建议改办 C-3-9 签证。",
          ],
          sourceIds: ["transit-ny", "piaodi-kr-transit"],
        },
        {
          id: "us-status-eligible",
          title: "确认你的美国身份符合在美申请资格",
          kind: "required",
          description:
            "官方要求。非美国公民在美申请须提交「在美合法长期居留」证明原件（绿卡 / 有效长期签证 / 有效 I-20 / 有效 EAD / 有效 I-797）；仅持 B1/B2 者不可在美申请；中美双重国籍者不受理。",
          sourceIds: ["ny-c39"],
        },
        {
          id: "visa-class",
          title: "确定签证类别与申请次数",
          kind: "required",
          description:
            "官方要求。个人观光 / 探访申请 C-3-9（90 天以内短期停留）；短期商务适用 C-3-1 / C-3-4。签发单次还是多次由领事审核材料后决定，申请多次须提交更强的财力与出行记录证明。",
          detailPoints: [
            "第三方报道：2026-03-30 起韩国放宽对华多次签（5 年 / 10 年），但口径以中国境内居住地为准，在美申请能否适用官方未明确，需向管辖领馆确认。",
            "在美领区常见最高 5 年多次；实发次数 / 年限可能低于申请且费用不退差价。",
          ],
          sourceIds: ["sf-c39", "visa-portal", "newsis-multi"],
        },
      ],
    },
    {
      id: "jurisdiction",
      slug: "jurisdiction",
      title: "查明管辖领馆与当前要求",
      milestone: "查明领区",
      summary:
        "在美申请实行严格领区管辖，且各领馆在递交方式、材料、缴费上差异极大——这是韩国流程中最重要的一步。",
      officialLinkIds: ["kr-jurisdiction", "embassy-guide"],
      tasks: [
        {
          id: "find-consulate",
          title: "按居住州确定管辖使领馆",
          kind: "required",
          description:
            "官方要求。必须向居住州所属使领馆申请，跨领区递交是最常见的退件原因。韩国在美设大使馆（DC）+ 纽约 / 旧金山 / 洛杉矶 / 波士顿 / 芝加哥 / 西雅图 / 亚特兰大 / 休斯敦 / 檀香山 / 关岛 / 安克雷奇等总领馆及费城、达拉斯办事处。",
          detailPoints: [
            "官方领区汇总表更新于 2015 年，个别归属已有调整：费城领事办现行页面称仅负责宾夕法尼亚 / 特拉华两州签证事务（与旧表列于纽约冲突），此类情况以领馆现行页面为准、递交前先确认。",
          ],
          sourceIds: ["kr-jurisdiction"],
        },
        {
          id: "check-current-reqs",
          title: "打开管辖领馆官网，逐项核对现行 C-3 要求（关键任务）",
          kind: "required",
          description:
            "官方要求。各馆要求差异大且随时调整（部分旧材料页已失效），递交前必须在管辖领馆官网找到现行 C-3 / C-3-9 页面逐项核对；任何与本站清单不一致处，以领馆当页为准。",
          detailPoints: [
            "递交方式：亲递是否需在线预约；是否接受邮寄及承运人要求（如旧金山只收 USPS）。",
            "材料清单：银行流水月数与余额基准各馆不同（纽约=近 3 个月、建议平均余额超过 3,000 美元；旧金山=1 个月内开具的流水或工资单）。",
            "缴费方式与 money order 抬头（各馆写法不同，写错有退件风险）。",
            "邮寄时是否需寄护照原件（洛杉矶不收原件、用公证复印件；旧金山要求寄原件）。",
            "处理时间口径与照片尺寸要求。",
          ],
          sourceIds: ["embassy-guide", "ny-c39", "sf-c39", "la-mail"],
        },
        {
          id: "district-residence-proof",
          title: "准备领区内居住证明（部分领馆要求）",
          kind: "conditional",
          description:
            "视情况（第三方经验）。洛杉矶总领馆自 2023 年 7 月起要求近 3 个月内显示领区内地址的文件（银行流水、水电账单等）；请勿因某馆「出签快」而跨领区递交。",
          sourceIds: ["piaodi-kr"],
        },
      ],
    },
    {
      id: "prepare",
      slug: "prepare",
      title: "准备申请材料",
      milestone: "准备材料",
      summary:
        "以已核实的纽约 / 旧金山官方清单为基准准备；资金证明口径按领馆执行，身份材料按你的美国身份准备。",
      officialLinkIds: ["ny-c39", "sf-c39"],
      tasks: [
        {
          id: "base-docs",
          title: "基础材料：申请表、照片、护照原件及复印件",
          kind: "required",
          description:
            "官方要求。签证申请表（官网现行版本）；6 个月内拍摄的彩色证件照（尺寸按领馆要求执行）；有效期剩余 6 个月以上的护照原件及复印件。",
          sourceIds: ["ny-c39", "sf-c39"],
        },
        ...variant.statusProofTasks,
        {
          id: "funds-proof",
          title: "资金证明（口径按领馆）",
          kind: "required",
          description:
            "官方要求。各馆口径不同、不能套用统一数字，展开看已核实的两馆基准。",
          detailPoints: [
            "纽约总领馆（官方）：近 3 个月银行流水；若旅费非公司承担，建议平均余额超过 3,000 美元。",
            "旧金山总领馆（官方）：1 个月内开具的银行流水或 1 个月内工资单。",
            "第三方经验：波士顿有「最近 1 个月流水 + 余额 >$3,000」的 DP，方向一致但月数不同——一切按管辖领馆当前要求执行。",
          ],
          sourceIds: ["ny-c39", "sf-c39", "piaodi-kr"],
        },
        {
          id: "itinerary-docs",
          title: "机票行程单与住宿安排（部分领馆要求）",
          kind: "conditional",
          description:
            "视情况。旧金山官方明确要求往返机票行程单、酒店预订单或接待人声明；缺机票 / 酒店订单也是常见退件原因，建议无论哪个领区都备上（可用可免费取消的预订）。",
          sourceIds: ["sf-c39", "piaodi-kr"],
        },
        {
          id: "mail-notarized",
          title: "邮寄申请：公证复印件或护照原件安排",
          kind: "conditional",
          description:
            "视情况。两种模式差异巨大，按领馆执行：洛杉矶邮寄不收护照等原件，须提交公证复印件（彩色、实际尺寸、不裁剪）；旧金山邮寄须寄护照原件，并附带追踪的 USPS 预付回邮信封。",
          sourceIds: ["la-mail", "sf-c39"],
        },
        {
          id: "multi-extra",
          title: "申请多次签证：加强财力与出行记录材料",
          kind: "conditional",
          description:
            "视情况（旧金山官方口径）。两个银行账户近 3 个月流水、约 1.5 个月工资单，并列出过去 5 年访问过的国家（最多 4 个）附佐证。",
          sourceIds: ["sf-c39"],
        },
        {
          id: "translation",
          title: "非英语 / 韩语文件附公证翻译",
          kind: "conditional",
          description: "视情况。旧金山官方要求非英 / 韩语文件须附公证翻译件。",
          sourceIds: ["sf-c39"],
        },
      ],
    },
    {
      id: "form-fee",
      slug: "form-fee",
      title: "填写申请表并备好签证费",
      milestone: "填表缴费",
      summary:
        "从领馆官网获取现行版申请表如实填写；按管辖领馆规定的方式与抬头准备签证费；亲递领馆同步完成预约。",
      officialLinkIds: ["embassy-fees", "embassy-guide"],
      tasks: [
        {
          id: "fill-form",
          title: "如实填写现行版本签证申请表",
          kind: "required",
          description:
            "官方填写项。从管辖领馆官网下载现行版本申请表如实填写；虚假陈述或伪造文件将被直接拒签并影响未来申请。本站不代填答案。",
          sourceIds: ["ny-c39"],
        },
        {
          id: "prepare-fee",
          title: "备好签证费（单次 USD 40 / 多次 USD 90）",
          kind: "required",
          description:
            "官方要求。中国籍按标准费率：90 天以内单次 USD 40、两次 USD 70、多次 USD 90（91 天以上单次 USD 60），无减免；展开看支付方式要点。",
          detailPoints: [
            "支付方式各馆不同：DC 收现金 / money order / cashier's check；旧金山仅现金或 money order、不收卡；洛杉矶邮寄仅收 money order；纽约可刷卡。",
            "money order 抬头没有全美统一写法（各馆要求不同），必须按管辖领馆官网当页要求填写，写错有退件风险。",
            "金额可能微调，以领馆现行公示为准。",
          ],
          sourceIds: ["embassy-fees", "sf-c39", "la-mail"],
        },
        {
          id: "book-appointment",
          title: "亲递者：完成在线预约",
          kind: "conditional",
          description:
            "视情况。亲递领馆普遍需预约：DC 大使馆只接受亲递且须在线预约；纽约需预约亲递；第三方经验称洛杉矶现场办理需提前约一周预约。",
          sourceIds: ["embassy-guide", "ny-c39", "piaodi-kr"],
        },
      ],
    },
    {
      id: "submit",
      slug: "submit",
      title: "递交申请（亲递或邮寄）",
      milestone: "递交申请",
      summary:
        "按管辖领馆规定亲递或邮寄；韩国签证没有生物信息采集环节，递交即完成申请动作。",
      officialLinkIds: ["embassy-guide", "sf-c39"],
      timelineEvents: [
        {
          id: "applicationSubmittedAt",
          label: "递交申请日期",
          description: "亲递日或邮寄寄出日，用于计算你自己的流程耗时与 ETA。",
        },
      ],
      tasks: [
        {
          id: "submit-in-person",
          title: "亲递：按预约时间本人到馆递交",
          kind: "conditional",
          description:
            "视情况。旧金山明确不允许第三方代交；亲递时护照通常当场核验后退回，无需长期离手（第三方经验：现场约 20 分钟受理）。",
          sourceIds: ["embassy-guide", "sf-c39", "piaodi-kr"],
        },
        {
          id: "submit-by-mail",
          title: "邮寄：严格按领馆邮寄规程寄出",
          kind: "conditional",
          description:
            "视情况。洛杉矶用 certified mail、不寄护照原件、签证费仅收 money order；旧金山仅接受 USPS、须寄护照原件并附回邮信封。寄出前逐项核对清单——旧金山官方明言缺件「不另行通知直接退回」。",
          sourceIds: ["la-mail", "sf-c39"],
        },
        {
          id: "submit-timing",
          title: "控制递交时机",
          kind: "recommended",
          description:
            "本站建议。官方审理约 2–3 周且全线无加急，建议至少提前 4–6 周递交；但也不要早于出行前 3 个月（有领馆提示不受理过早申请，第三方经验记录）。",
          sourceIds: ["embassy-guide", "piaodi-kr"],
        },
      ],
    },
    {
      id: "review",
      slug: "review",
      title: "等待审理与查询进度",
      milestone: "等待审理",
      summary:
        "官方口径约 2–3 周、无加急无例外；可在 Korea Visa Portal 自助查询，领馆不提供电话查询。",
      officialLinkIds: ["visa-status", "embassy-guide"],
      tasks: [
        {
          id: "review-timeline",
          title: "了解审理时长口径",
          kind: "informational",
          description:
            "官方口径。DC 大使馆「通常 2–3 周」；洛杉矶「所有申请审理超过 14 天，无加急、无例外」（邮寄再多 1–5 个工作日）；旧金山「约 2 周」且不提供进度更新。",
          sourceIds: ["embassy-guide", "sf-c39"],
        },
        {
          id: "check-status",
          title: "在 Korea Visa Portal 查询进度",
          kind: "recommended",
          description:
            "本站建议。在 visa.go.kr 的进度查询用护照号 + 英文姓名 + 出生日期查询（申请类型选 Diplomatic Office）；本站不代查、不保存你的护照号。",
          sourceIds: ["visa-status"],
        },
        {
          id: "respond-rfe",
          title: "如被要求补件或面谈，已按通知处理",
          kind: "conditional",
          description:
            "视情况。缺必需材料时领馆在补齐前不会继续审理；需要补件或面谈时签证官会主动联系，保持电话与邮箱畅通。",
          sourceIds: ["la-mail"],
        },
      ],
    },
    {
      id: "complete",
      slug: "complete",
      title: "取签、核对并准备出行",
      milestone: "取签核对",
      summary:
        "韩国签证是无贴纸电子签：获批后自行打印 Visa Grant Notice 即签证本体；取回护照（如寄了原件）并逐项核对。",
      officialLinkIds: ["visa-portal", "ny-c39"],
      timelineEvents: [
        {
          id: "visaIssuedAt",
          label: "签证获批日期",
          description: "以 visa.go.kr 显示或领馆通知为准。",
        },
        {
          id: "passportReceivedAt",
          label: "取回护照日期（如递交了原件）",
          description: "亲递当场退回护照的可留空。",
        },
      ],
      tasks: [
        {
          id: "print-grant-notice",
          title: "在 visa.go.kr 下载打印 Visa Grant Notice",
          kind: "required",
          description:
            "官方要求。获批后自行下载打印 Visa Grant Notice——它就是签证本体，护照上不贴任何贴纸；入境韩国时须随护照携带打印件。",
          sourceIds: ["visa-portal", "ny-c39"],
        },
        {
          id: "retrieve-passport",
          title: "取回护照（如递交了原件）",
          kind: "conditional",
          description:
            "视情况。旧金山等寄了护照原件的：本人凭 photo ID 到馆自取，或经回邮信封收回；亲递领馆多为当场核验后即退护照，可标记不适用。",
          sourceIds: ["sf-c39"],
          allowNotApplicable: true,
        },
        {
          id: "verify-details",
          title: "逐项核对签证信息",
          kind: "required",
          description:
            "本站建议。核对 Visa Grant Notice 上的姓名拼写、护照号、签证类别（C-3-9 等）、单次 / 多次、有效期与每次停留期，发现错误立即联系领馆。",
          detailPoints: [
            "实发次数 / 年限可能与申请不一致（由领事裁量，有降级案例），费用不退差价。",
            "每次可停留天数以你实际收到的 Grant Notice 为准。",
          ],
          sourceIds: ["sf-c39"],
        },
        {
          id: "pre-departure",
          title: "行前再确认",
          kind: "recommended",
          description:
            "本站建议。出发前确认：Grant Notice 已打印并随护照携带；护照有效期覆盖行程；签证有效期与停留期覆盖全部行程日期。",
          sourceIds: ["ny-c39"],
        },
        {
          id: "timeline-reviewed",
          title: "已回顾各阶段日期",
          kind: "recommended",
          description:
            "本站建议。回顾本地记录的各阶段日期是否准确，便于估算自己的耗时；本站不上传、不收集任何申请编号。",
        },
      ],
    },
  ];
}

export function buildKrVisitorFlow(
  identity: SupportedIdentityCode,
): FlowConfig {
  const variant = identityVariants[identity];

  return {
    id: `kr-visitor-${variant.statusSlug}`,
    version: "0.3",
    countryCode: "KR",
    countrySlug: "kr",
    countryName: "韩国",
    countryFlag: "🇰🇷",
    visaType: "短期访问签证（C-3）",
    visaTypeSlug: "visitor",
    status: identity,
    statusSlug: variant.statusSlug,
    statusLabel: variant.statusLabel,
    audience: variant.audience,
    nationality: {
      label: "中国普通护照",
      slug: "cn-ordinary",
      note: "中国大陆普通护照不能使用 K-ETA，赴韩需 C-3 签证（符合过境免签 B-2 条件的中转行程除外）。其他国籍可能免签或可用 K-ETA，请以官方页面为准。",
    },
    lastVerified: "2026-07-07",
    officialFee:
      "90 天以内单次 USD 40；两次 USD 70、多次 USD 90（91 天以上单次 USD 60）。中国籍按标准费率、无减免；支付方式与 money order 抬头以管辖领馆公示为准",
    feeItems: [
      {
        id: "visa-fee",
        label: "签证费（90 天以内单次）",
        amount: 40,
        currency: "USD",
        note: "两次 USD 70、多次 USD 90，91 天以上单次 USD 60；中国籍按标准费率、无减免；支付方式与 money order 抬头以管辖领馆公示为准",
      },
    ],
    etaStages: [
      {
        id: "review",
        label: "领馆审理（收件后）",
        minDays: 14,
        maxDays: 21,
        basis: "official",
        sourceId: "embassy-guide",
        note: "官方口径：DC「通常 2–3 周」；洛杉矶「超过 14 天、无加急无例外」；旧金山「约 2 周」且不提供进度更新。",
      },
      {
        id: "mail-extra",
        label: "邮寄附加时间（仅邮寄申请）",
        minDays: 0,
        maxDays: 10,
        basis: "experience",
        note: "含双程快递在途与邮寄件的额外审理时间（洛杉矶官方称邮寄比现场多 1–5 个工作日）；亲递申请此段接近 0。",
      },
      {
        id: "issue-download",
        label: "出签下载与护照取回",
        minDays: 0,
        maxDays: 3,
        basis: "experience",
        note: "电子签获批后即可在 visa.go.kr 自行打印；寄了护照原件的另计自取或回邮时间。",
      },
    ],
    processingTimeSourceId: "visa-status",
    sources: [
      {
        id: "embassy-guide",
        label: "签证申请指南（递交方式 / 处理时间）",
        organization: EMB_KR,
        url: "https://overseas.mofa.go.kr/us-en/brd/m_4502/view.do?seq=706999&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "embassy-fees",
        label: "签证费标准表（单次 $40 / 两次 $70 / 多次 $90）",
        organization: EMB_KR,
        url: "https://overseas.mofa.go.kr/us-en/brd/m_4502/view.do?seq=715889&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "ny-c39",
        label: "C-3-9 申请要求（身份证明 / 资金 / 电子签说明）",
        organization: CG_NY,
        url: "https://overseas.mofa.go.kr/us-newyork-en/brd/m_25545/view.do?seq=13&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "sf-c39",
        label: "C-3 申请要求（邮寄规程 / 多次签材料 / 退件规则）",
        organization: CG_SF,
        url: "https://overseas.mofa.go.kr/us-sanfrancisco-en/brd/m_24317/view.do?seq=16&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "la-mail",
        label: "邮寄申请规程（不寄原件 / 公证复印件）",
        organization: CG_LA,
        url: "https://overseas.mofa.go.kr/us-losangeles-en/brd/m_24594/view.do?seq=4&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "kr-jurisdiction",
        label: "驻美使领馆领区划分表（2015 年公告，个别归属以领馆现行页面为准）",
        organization: CG_HOU,
        url: "https://overseas.mofa.go.kr/us-houston-en/brd/m_5573/view.do?seq=723686",
        lastVerified: "2026-07-07",
      },
      {
        id: "transit-ny",
        label: "过境免签 B-2（Tourists in Transit）公示",
        organization: CG_NY,
        url: "https://overseas.mofa.go.kr/us-newyork-en/brd/m_25545/view.do?seq=12&page=1",
        lastVerified: "2026-07-07",
      },
      {
        id: "keta",
        label: "K-ETA 官网（适用前提：免签国家国民）",
        organization: KETA,
        url: "https://www.k-eta.go.kr/portal/apply/index.do",
        lastVerified: "2026-07-07",
      },
      {
        id: "visa-portal",
        label: "Korea Visa Portal（签证类别 / 电子签门户）",
        organization: MOJ_VISA,
        url: "https://www.visa.go.kr/openPage.do?MENU_ID=10101",
        lastVerified: "2026-07-07",
      },
      {
        id: "visa-status",
        label: "签证申请进度查询",
        organization: MOJ_VISA,
        url: "https://www.visa.go.kr/openPage.do?MENU_ID=10301",
        lastVerified: "2026-07-07",
      },
      {
        id: "cbp-i94",
        label: "I-94 在线查询与打印",
        organization: CBP,
        url: "https://i94.cbp.dhs.gov/",
        lastVerified: "2026-07-07",
      },
      {
        id: "i20-info",
        label: "如何获取 I-20（由学校 DSO 签发，无自助下载）",
        organization: SEVP,
        url: "https://studyinthestates.dhs.gov/students/get-your-form-i-20",
        lastVerified: "2026-07-07",
      },
      {
        id: "uscis-i797",
        label: "I-797 批准通知说明",
        organization: USCIS,
        url: "https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions",
        lastVerified: "2026-07-07",
      },
      {
        id: "piaodi-kr",
        label: "在美国办理韩国旅游签证指南（第三方经验）",
        organization: PIAODI,
        url: "https://piao.tips/korean-visa-in-the-us/",
        lastVerified: "2026-07-07",
      },
      {
        id: "newsis-multi",
        label: "对华 5 年 / 10 年多次签放宽报道（第三方报道，非官方）",
        organization: "Newsis（韩国媒体，非官方）",
        url: "https://www.newsis.com/view/NISX20260618_0003673934",
        lastVerified: "2026-07-07",
      },
      {
        id: "piaodi-kr-transit",
        label: "韩国转机 / 过境免签解读（第三方经验）",
        organization: PIAODI,
        url: "https://piao.tips/south_korea_transfer_guide/",
        lastVerified: "2026-07-07",
      },
    ],
    steps: buildSteps(variant),
  };
}

export const krVisitorF1Flow = buildKrVisitorFlow("F1");
export const krVisitorH1bFlow = buildKrVisitorFlow("H1B");
