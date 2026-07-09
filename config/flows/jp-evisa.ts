import type { FlowConfig, FlowStep, FlowTask } from "@/lib/flow-types";
import type { SupportedIdentityCode } from "@/config/identities";

const MOFA = "日本外务省（MOFA）";
const EVISA = "日本外务省 JAPAN eVISA 官网";
const EMB_US = "日本驻美国大使馆（华盛顿 DC）";
const CG_NY = "日本驻纽约总领事馆";
const CG_DETROIT = "日本驻底特律总领事馆";
const CG_BOSTON = "日本驻波士顿总领事馆";
const CG_SF = "日本驻旧金山总领事馆";
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
      "持中国普通护照、年满 18 岁、目前以 F-1 身份在美国学习、计划赴日短期观光的申请人",
    statusProofTasks: [
      {
        id: "i20-travel-endorsement",
        title: "含有效旅行签注（travel endorsement）的 I-20",
        kind: "required",
        description:
          "官方要求（驻美大使馆）。F-1 须提供签满字的、含有效 travel endorsement 的 I-20；申请前先请学校 DSO 确认签注未过期。",
        sourceIds: ["us-embassy-visa", "i20-info"],
      },
      {
        id: "i94-enrollment",
        title: "I-94 记录与在读证明",
        kind: "recommended",
        description:
          "本站建议（第三方经验）。部分领馆清单还会列出 I-94 打印件、在读证明与护照美签页复印件，备上更稳妥；I-94 可在 CBP 官方站查询打印。",
        sourceIds: ["cbp-i94", "piaodi-jp-consolidated"],
      },
    ],
  },
  H1B: {
    statusSlug: "h1b",
    statusLabel: "H-1B 工作身份",
    audience:
      "持中国普通护照、年满 18 岁、目前以 H-1B 身份在美国工作、计划赴日短期观光的申请人",
    statusProofTasks: [
      {
        id: "h1b-visa-i797",
        title: "H-1B 签证页与 I-797 批准通知",
        kind: "required",
        description:
          "官方要求（旧金山总领馆清单口径）。H-1B 以签证页 + I-797 批准通知作为在美身份证明。",
        detailPoints: [
          "签证贴纸已过期但身份有效（I-797 / I-94 在期）：各领馆无统一成文政策，第三方经验显示有获批案例也有疑似拒绝案例，此情形建议先电话或邮件咨询你的管辖领馆再提交。",
        ],
        sourceIds: [
          "us-embassy-visa",
          "sf-multi-checklist",
          "uscis-i797",
          "piaodi-jp-consolidated",
        ],
      },
      {
        id: "evl-paystub-i94",
        title: "在职信、近期工资单与 I-94",
        kind: "recommended",
        description:
          "本站建议（第三方经验）。注明职位、入职时间与薪资的在职信、近 2–3 个月工资单与 I-94 打印件可佐证身份与约束力，备上更稳妥。",
        sourceIds: ["cbp-i94", "piaodi-jp-consolidated"],
      },
    ],
  },
};

function buildSteps(variant: IdentityVariant): FlowStep[] {
  return [
    {
      id: "overview",
      slug: "overview",
      title: "了解流程与确认 eVISA 适用",
      milestone: "了解流程",
      summary:
        "日本主路径是全程在线的 JAPAN eVISA（单次短期观光）；先确认自己适用，看清费用与时间，再开始准备。",
      officialLinkIds: ["mofa-evisa", "evisa-faq", "us-embassy-visa"],
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
            "访问目的为短期观光，结束后按时离开日本并返回美国。",
            "护照在有效期内（建议留有至少 1.5 页空白页），并用同一本护照申请与旅行。",
            "有明确的旅行计划（申请需要逐日行程表与机票行程单）。",
            "能负担申请与旅行费用。",
            "没有需要专业协助的犯罪、移民或健康复杂情况；如有拒签史等特殊情况，请先咨询合格专业人士。",
          ],
          sourceIds: ["us-embassy-visa"],
        },
        {
          id: "evisa-eligibility",
          title: "确认符合 eVISA 全部适用条件",
          kind: "required",
          description:
            "官方要求。JAPAN eVISA 面向居住在美国等地的外国国籍者开放，居住在美国的中国普通护照持有人可申请；展开逐条核对适用条件。",
          detailPoints: [
            "仅限普通护照（公务 / 外交护照不可）。",
            "仅限乘飞机（或日本—釜山 / 上海定期国际客轮）赴日。",
            "从申请到出签期间必须人在美国境内、不得离境（可能被要求到管辖使领馆面试）。",
            "需要本人信用卡在线缴费（无信用卡只能走纸质路径）。",
            "值机时需用智能手机等设备联网实时展示电子签证（无此类设备只能走纸质路径）。",
            "官方明示不接受 B-1/B-2 短期身份者申请；第三方经验：领馆会核查你的 I-94 与长期居留身份。",
          ],
          sourceIds: ["mofa-evisa", "us-embassy-visa", "piaodi-jp-evisa"],
        },
        {
          id: "evisa-scope",
          title: "了解 eVISA 只覆盖「单次入境短期观光」",
          kind: "informational",
          description:
            "官方口径。eVISA 只能申请单次入境短期观光签证（停留 15/30/90 天由使领馆裁量）；多次往返、探亲访友、商务、过境等都不能走 eVISA，需走下方的纸质路径。",
          sourceIds: ["mofa-evisa", "us-embassy-visa"],
        },
        {
          id: "paper-path",
          title: "需要多次往返或不符合 eVISA？改走领馆纸质申请",
          kind: "conditional",
          description:
            "视情况。纸质路径向居住地管辖的日本使领馆申请（跨领区不受理），材料与 eVISA 基本相同，另加纸质申请表与贴照片；展开看纸质路径要点。",
          detailPoints: [
            "领区管辖：必须向居住地所属领区的大使馆 / 总领事馆申请；第三方经验称部分领馆按 I-20 / I-797 上的学校 / 雇主所在地判定，与居住地不一致时先联系领馆确认。",
            "递交方式各馆差异大（纽约可预约亲递或 USPS 邮寄、旧金山只收邮寄 / drop-off 等），以本领区官网现行说明为准。",
            "签证费在取签时支付：2026-07-01 起单次 USD 101、多次 USD 201（以本领区费用页为准）；一般收现金 / money order / cashier's check，不收个人支票和信用卡。",
            "多次往返签证：外务省对居住海外的中国公民设专门类别（「相当高收入者」5 年多次、「有足够经济能力者」3 年多次），需在职证明、工资单与近 6 个月本人名下流水等更强材料；资金门槛官方未公布，建议先电话领馆确认。",
            "常规审理约 4–7 个工作日（各馆略异）；需报东京外务省复核的个案（多次签更常见）需 1–2 个月。",
            "同一时间只能持有一个有效日本签证；材料不得用订书钉装订（纽约总领馆规则）。",
          ],
          sourceIds: [
            "ny-visa",
            "jp-jurisdiction",
            "mofa-china-multi",
            "sf-multi-checklist",
            "piaodi-jp-consolidated",
          ],
        },
        {
          id: "official-site-only",
          title: "认准唯一官网 evisa.mofa.go.jp，谨防钓鱼网站",
          kind: "required",
          description:
            "官方要求。官方多次警告存在仿冒 JAPAN eVISA 的钓鱼网站；唯一官网为 evisa.mofa.go.jp。本站链接均指向官方入口。",
          sourceIds: ["evisa-portal", "us-embassy-visa"],
        },
        {
          id: "plan-timing",
          title: "我已按上方 ETA 规划提交时间",
          kind: "recommended",
          description:
            "本站建议。最早可在计划赴日日期前 3 个月提交，官方与第三方均建议提前 1–1.5 个月；全程无加急服务，旺季更要预留缓冲。",
          sourceIds: ["evisa-faq", "piaodi-jp-evisa"],
        },
      ],
    },
    {
      id: "prepare",
      slug: "prepare",
      title: "准备申请材料",
      milestone: "准备材料",
      summary:
        "按驻美使领馆清单备齐材料，并扫描成合规电子文件；材料不全或图像模糊是最常见的退件原因。",
      officialLinkIds: ["us-embassy-visa", "evisa-faq"],
      tasks: [
        {
          id: "passport-scan",
          title: "有效护照与清晰的资料页扫描",
          kind: "required",
          description:
            "官方要求。有效中国普通护照（建议至少 1.5 页空白页）；上传的资料页须含完整清晰的 MRZ 机读码（页面底部两行）。",
          sourceIds: ["us-embassy-visa", "evisa-faq"],
        },
        {
          id: "photo",
          title: "6 个月内拍摄的 2×2 英寸证件照",
          kind: "required",
          description:
            "官方要求。6 个月内拍摄、纯色背景。第三方经验：领馆会核查照片文件的 EXIF 拍摄时间，复用旧照片会被要求重拍重传，曾把出签拖长到数周。",
          sourceIds: ["us-embassy-visa", "piaodi-jp-evisa"],
        },
        ...variant.statusProofTasks,
        {
          id: "residence-proof",
          title: "在美居住证明",
          kind: "required",
          description:
            "官方要求。驾照、州 ID 或水电账单等能证明你居住地址的文件。",
          sourceIds: ["us-embassy-visa"],
        },
        {
          id: "schedule-of-stay",
          title: "详细的逐日行程表（Schedule of Stay）",
          kind: "required",
          description:
            "官方要求。每日行程须具体——只写 sightseeing in Tokyo 会被退回；行程日期必须与机票完全一致、逐日连贯无断档。",
          sourceIds: ["us-embassy-visa", "piaodi-jp-evisa"],
        },
        {
          id: "flight-itinerary",
          title: "往返机票行程单（无需出票）",
          kind: "required",
          description:
            "官方要求。往返机票行程单即可、无需实际出票；第三方经验：常用可免费取消 / 改期的预订，行程单须含航空公司确认号。",
          sourceIds: ["us-embassy-visa", "piaodi-jp-evisa"],
        },
        {
          id: "bank-statement",
          title: "最近 1 个月银行账单",
          kind: "required",
          description:
            "官方要求（驻美大使馆·观光单次口径）。最近 1 个月银行账单，不接受在职证明或工资单替代；第三方经验：单次观光对金额较宽松，保持数千美元余额即可。",
          sourceIds: ["us-embassy-visa", "piaodi-jp-evisa"],
        },
        {
          id: "scan-quality",
          title: "用扫描件而非手机随手拍，按规格整理文件",
          kind: "recommended",
          description:
            "本站建议。官方警告约 80% 的在线申请因材料缺失或图像模糊被退回；单文件建议不超过 2MB，同一项的多份文件合并成单个 PDF。",
          sourceIds: ["us-embassy-visa", "evisa-faq"],
        },
      ],
    },
    {
      id: "apply",
      slug: "apply",
      title: "注册账户并在线申请",
      milestone: "在线申请",
      summary:
        "在 evisa.mofa.go.jp 注册账户、填表、上传全部材料并提交，由居住地管辖的日本使领馆审核。",
      officialLinkIds: ["evisa-portal", "evisa-faq"],
      timelineEvents: [
        {
          id: "applicationSubmittedAt",
          label: "在线提交日期",
          description: "记录日期用于计算你自己的流程耗时与 ETA。",
        },
      ],
      tasks: [
        {
          id: "register-account",
          title: "用常用邮箱在官网注册账户",
          kind: "required",
          description:
            "官方填写项。缴费通知与出签通知都发到注册邮箱，务必使用能及时查收的常用邮箱。",
          sourceIds: ["evisa-portal", "evisa-faq"],
        },
        {
          id: "fill-upload",
          title: "在线填写申请表并上传全部材料",
          kind: "required",
          description:
            "官方填写项。如实填写并上传护照资料页、照片及各项证明文件；系统无手动保存按钮但有自动保存，中断后可在申请列表找回草稿。本站不代填、不读取你的账户。",
          sourceIds: ["evisa-faq"],
        },
        {
          id: "submit",
          title: "提交前逐项复核后提交申请",
          kind: "required",
          description:
            "官方要求。不完整的申请会被退回或取消，取消后须重新申请；提交前逐项核对材料清晰完整。",
          sourceIds: ["evisa-faq"],
        },
        {
          id: "stay-in-us",
          title: "提交后至出签期间不要离开美国",
          kind: "informational",
          description:
            "官方要求。申请期间必须人身在美国境内，因为可能被要求亲赴管辖使领馆面试。",
          sourceIds: ["mofa-evisa"],
        },
      ],
    },
    {
      id: "review",
      slug: "review",
      title: "等待审理",
      milestone: "等待审理",
      summary:
        "材料齐全后原则上 5 个工作日审结，旺季或补件时更久；期间留意邮箱，按期响应补件或面试要求。",
      officialLinkIds: ["evisa-faq"],
      tasks: [
        {
          id: "review-timeline",
          title: "了解审理时间口径",
          kind: "informational",
          description:
            "官方口径。审理时钟从「使领馆确认材料齐全」起算而非提交日：原则上 5 个工作日审结，旺季、补件、面试或报东京复核时可能超过 1 个月。第三方经验（2023–2024）：各领馆全程 2–23 天不等，纽约领区偏慢。",
          sourceIds: ["evisa-faq", "piaodi-jp-evisa"],
        },
        {
          id: "respond-rfe",
          title: "如收到补件邮件，已在限期内补齐",
          kind: "conditional",
          description:
            "视情况。材料缺件或不合格会收到邮件通知，须在限期内补齐，否则申请自动取消；常见补件原因是照片不符 6 个月要求、行程与机票日期不符。",
          sourceIds: ["evisa-faq"],
        },
        {
          id: "possible-interview",
          title: "如被要求面试，已按通知到馆",
          kind: "conditional",
          description:
            "视情况。审核中使领馆可要求申请人亲自到管辖使领馆面试——这也是申请期间必须留在美国的原因。",
          sourceIds: ["mofa-evisa"],
        },
      ],
    },
    {
      id: "pay",
      slug: "pay",
      title: "收到缴费通知后在线缴费",
      milestone: "在线缴费",
      summary:
        "审核通过后收到「Notification of visa fee」邮件，登录账户注册信用卡在线支付签证费。",
      officialLinkIds: ["boston-payment", "fee-change"],
      timelineEvents: [
        {
          id: "feeNoticeReceivedAt",
          label: "收到缴费通知日期",
          description: "以 eVISA 系统邮件时间为准。",
        },
        {
          id: "feePaidAt",
          label: "完成在线缴费日期",
          description: "用于估算缴费到出签的耗时。",
        },
      ],
      tasks: [
        {
          id: "pay-online",
          title: "收到「Notification of visa fee」后登录缴费",
          kind: "required",
          description:
            "官方要求。必须收到缴费通知邮件后才能登录注册信用卡付款；原则上须用申请人本人的信用卡，扣款以日元计价，领馆不出具收据；2024-06 起仅支持在线信用卡支付。",
          sourceIds: ["boston-payment", "evisa-faq"],
        },
        {
          id: "fee-standard",
          title: "了解现行费用标准（2026-07-01 起已上调）",
          kind: "informational",
          description:
            "官方口径。日本签证费 48 年来首次上调：2026-07-01 起受理的申请单次约 15,000 日元（美国领区纸签费用表为 USD 101）；中国国籍不在免签证费名单内。拒签不收费，出签后任何原因均不退费。网上旧攻略的 $20–28 已全部过时，以官方费用页与系统显示金额为准。",
          sourceIds: ["fee-change", "detroit-fees"],
        },
        {
          id: "use-us-card",
          title: "优先使用美国发行的本人信用卡",
          kind: "recommended",
          description:
            "本站建议（第三方经验）。在线缴费可能触发信用卡风控导致失败并拖延出签，建议用美国发行的信用卡。",
          sourceIds: ["boston-payment", "piaodi-jp-evisa"],
        },
      ],
    },
    {
      id: "issue",
      slug: "issue",
      title: "收取电子签证",
      milestone: "收取电子签",
      summary:
        "缴费处理完成后收到出签通知，登录账户查看 Visa issuance notice——这就是你的电子签证，护照上不会有贴纸。",
      officialLinkIds: ["evisa-portal", "evisa-faq"],
      timelineEvents: [
        {
          id: "visaIssuedAt",
          label: "收到电子签证日期",
          description: "用于计算从提交到出签的总耗时。",
        },
      ],
      tasks: [
        {
          id: "view-issuance-notice",
          title: "登录账户查看 Visa issuance notice",
          kind: "required",
          description:
            "官方要求。缴费处理后收到「Notification of electronic visa issuance」邮件，登录 eVISA 账户查看电子签证；注册信用卡后并非立即出签，需等使领馆确认（DC 时间线：当天约 16:00 或次一工作日）。",
          sourceIds: ["evisa-faq", "us-embassy-visa"],
        },
        {
          id: "evisa-validity",
          title: "了解电子签证的有效期与形态",
          kind: "informational",
          description:
            "官方口径。eVISA 自签发次日起 3 个月内有效、单次入境、不可延期；实际入境日期可与申请填写的不同（有效期内即可）；护照上无贴纸。",
          sourceIds: ["evisa-faq", "mofa-evisa"],
        },
      ],
    },
    {
      id: "complete",
      slug: "complete",
      title: "核对签证并准备出行",
      milestone: "核对完成",
      summary:
        "核对签证信息与获批停留天数，牢记值机时必须联网实时展示电子签证，完成本站流程。",
      officialLinkIds: ["mofa-evisa", "evisa-faq"],
      tasks: [
        {
          id: "verify-details",
          title: "签证信息与获批停留天数已核对",
          kind: "required",
          description:
            "进度确认。核对姓名、护照号、有效期与停留天数——停留期由使领馆在 15/30/90 天中裁量（第三方经验：常见获批 15 天），按获批天数规划行程。",
          sourceIds: ["mofa-evisa", "piaodi-jp-evisa"],
        },
        {
          id: "online-display",
          title: "值机时联网实时展示 Visa issuance notice",
          kind: "required",
          description:
            "官方要求。值机时必须在联网状态下于手机 / 平板上实时打开显示电子签证，PDF 文件、截图、打印件一律不被接受；确保出行当天设备可上网。",
          sourceIds: ["mofa-evisa", "evisa-faq"],
        },
        {
          id: "same-passport",
          title: "持申请时使用的同一本护照出行",
          kind: "informational",
          description:
            "官方要求。换发新护照后旧 eVISA 作废、须重新申请；入境日本后 eVISA 随落地许可自动失效。被拒签后 6 个月内不得再次申请。",
          sourceIds: ["evisa-faq"],
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

export function buildJpEvisaFlow(identity: SupportedIdentityCode): FlowConfig {
  const variant = identityVariants[identity];

  return {
    id: `jp-visitor-${variant.statusSlug}`,
    version: "0.3",
    countryCode: "JP",
    countrySlug: "jp",
    countryName: "日本",
    countryFlag: "🇯🇵",
    visaType: "短期观光签证（eVISA）",
    visaTypeSlug: "visitor",
    status: identity,
    statusSlug: variant.statusSlug,
    statusLabel: variant.statusLabel,
    audience: variant.audience,
    nationality: {
      label: "中国普通护照",
      slug: "cn-ordinary",
      note: "中国普通护照赴日需事先取得签证；居住在美国的中国公民可用 JAPAN eVISA 在线申请单次短期观光签证。其他国籍可能免签，请以日本外务省页面为准。",
    },
    lastVerified: "2026-07-07",
    officialFee:
      "单次约 15,000 日元（2026-07-01 起上调后的新标准；美国领区纸签费用表为单次 USD 101、多次 USD 201，多次仅纸质路径可申请），以官方费用页与 eVISA 系统显示为准",
    feeItems: [
      {
        id: "evisa-fee",
        label: "eVISA 签证费（单次观光）",
        amount: 15000,
        currency: "JPY",
        approximate: true,
        note: "2026-07-01 起上调后的新标准；系统内实际扣款金额以支付页显示为准（走领馆纸质路径时美国领区为单次 USD 101、多次 USD 201）",
      },
    ],
    etaStages: [
      {
        id: "review",
        label: "使领馆审理（材料齐全起算）",
        minDays: 5,
        maxDays: 30,
        basis: "official",
        sourceId: "evisa-faq",
        note: "官方口径：原则上 5 个工作日审结；旺季、补件、面试或报东京复核可超 1 个月；审理时钟从材料齐全起算。第三方经验（2023–2024）：各领馆全程 2–23 天不等。",
      },
      {
        id: "fee-to-issue",
        label: "缴费通知 → 出签",
        minDays: 0,
        maxDays: 2,
        basis: "official",
        sourceId: "evisa-faq",
        note: "DC 大使馆时间线：注册信用卡后当天约 16:00 或次一工作日出签。",
      },
    ],
    processingTimeSourceId: "evisa-faq",
    sources: [
      {
        id: "evisa-portal",
        label: "JAPAN eVISA 官方申请入口（唯一官网）",
        organization: EVISA,
        url: "https://www.evisa.mofa.go.jp/",
        lastVerified: "2026-07-07",
      },
      {
        id: "mofa-evisa",
        label: "JAPAN eVISA 官方说明（资格 / 流程 / 展示要求）",
        organization: MOFA,
        url: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "evisa-faq",
        label: "JAPAN eVISA 官方 FAQ（步骤 / 时限 / 缴费 / 有效期）",
        organization: EVISA,
        url: "https://www.evisa.mofa.go.jp/faq",
        lastVerified: "2026-07-07",
      },
      {
        id: "us-embassy-visa",
        label: "短期访问签证与 eVISA 材料要求（驻美使团）",
        organization: EMB_US,
        url: "https://www.us.emb-japan.go.jp/itpr_en/visa-short-term-visit.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "ny-visa",
        label: "纸质签证申请总页（递交方式 / 处理时间）",
        organization: CG_NY,
        url: "https://www.ny.us.emb-japan.go.jp/itpr_en/visa00.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "jp-jurisdiction",
        label: "驻美使领馆领区划分",
        organization: CG_NY,
        url: "https://www.ny.us.emb-japan.go.jp/itpr_en/jurisdiction.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "fee-change",
        label: "签证费 2026-07-01 起调整公告",
        organization: MOFA,
        url: "https://www.mofa.go.jp/j_info/visit/visa/procedure/pagewe_000001_00391.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "detroit-fees",
        label: "驻美领区签证费美元价目表（2026-07-01 生效）",
        organization: CG_DETROIT,
        url: "https://www.detroit.us.emb-japan.go.jp/itpr_ja/11_000001_00249.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "boston-payment",
        label: "eVISA 在线缴费规则（仅限信用卡）",
        organization: CG_BOSTON,
        url: "https://www.boston.us.emb-japan.go.jp/itpr_en/11_000001_00528.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "mofa-china-multi",
        label: "对中国公民的多次往返签证类别（含海外居住者）",
        organization: MOFA,
        url: "https://www.mofa.go.jp/j_info/visit/visa/topics/china.html",
        lastVerified: "2026-07-07",
      },
      {
        id: "sf-multi-checklist",
        label: "中国公民多次往返签证材料清单（PDF）",
        organization: CG_SF,
        url: "https://www.sf.us.emb-japan.go.jp/files/100403849.pdf",
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
        id: "piaodi-jp-evisa",
        label: "日本 eVISA 申请指南（第三方经验）",
        organization: PIAODI,
        url: "https://piao.tips/japan-evisa/",
        lastVerified: "2026-07-07",
      },
      {
        id: "piaodi-jp-consolidated",
        label: "在美申请日本签证综合指南（第三方经验）",
        organization: PIAODI,
        url: "https://piao.tips/japan-visa-in-the-us-consolidated/",
        lastVerified: "2026-07-07",
      },
    ],
    steps: buildSteps(variant),
  };
}

export const jpVisitorF1Flow = buildJpEvisaFlow("F1");
export const jpVisitorH1bFlow = buildJpEvisaFlow("H1B");
