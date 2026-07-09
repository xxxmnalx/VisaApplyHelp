import type { FlowConfig, FlowStep, FlowTask } from "@/lib/flow-types";
import type { SupportedIdentityCode } from "@/config/identities";

const IRCC = "加拿大移民、难民及公民部（IRCC）";
const CBP = "美国海关与边境保护局（CBP）";
const SEVP = "美国 SEVP / 国土安全部（DHS）";
const USCIS = "美国公民及移民服务局（USCIS）";
const VFS = "VFS Global（IRCC 授权服务商，非政府机构）";

/** 身份差异集中在这里：文案、材料任务与资金说明按身份切换，其余步骤共享。 */
type IdentityVariant = {
  statusSlug: string;
  statusLabel: string;
  audience: string;
  /** 「准备材料」步中整理行程信息的任务。 */
  itineraryTask: FlowTask;
  /** 「准备材料」步中证明在美身份的材料任务。 */
  statusProofTasks: FlowTask[];
  /** 资金说明中关于 CAN+ 的那一条（按身份措辞）。 */
  canPlusPoint: string;
};

const identityVariants: Record<SupportedIdentityCode, IdentityVariant> = {
  F1: {
    statusSlug: "f1",
    statusLabel: "F-1 在读学生",
    audience: "持中国普通护照、年满 18 岁、目前以 F-1 身份在美国学习的申请人",
    itineraryTask: {
      id: "prep-study-travel",
      title: "整理学习与行程信息",
      kind: "required",
      description:
        "准备项。整理学校在读信息、预计入境 / 离境日期、旅行目的与简短行程。",
    },
    statusProofTasks: [
      {
        id: "i20",
        title: "有效 I-20",
        kind: "recommended",
        description:
          "本站建议（F-1）。佐证在读身份与返美约束，非 IRCC 固定要求；I-20 由学校 DSO 经 SEVIS 签发，无自助下载入口，向本校国际学生办公室索取。",
        sourceIds: ["i20-info"],
      },
      {
        id: "i94",
        title: "I-94 入境记录",
        kind: "recommended",
        description:
          "本站建议。佐证你在美合法停留；可在 CBP 官方站查询并打印最新记录与旅行史。",
        sourceIds: ["cbp-i94"],
      },
    ],
    canPlusPoint:
      "F-1 利好（官方 CAN+）：近 10 年内持有过加签、或持有效美国非移民签证（F-1 签证在有效期内即符合）者会被自动按 CAN+ 加速审理，材料上提供有效美签复印件即可，实践中个性化清单常不再单独要求资金证明；「可不交」不等于「不需要具备」，签证官保留补件权。",
  },
  H1B: {
    statusSlug: "h1b",
    statusLabel: "H-1B 工作身份",
    audience: "持中国普通护照、年满 18 岁、目前以 H-1B 身份在美国工作的申请人",
    itineraryTask: {
      id: "prep-work-travel",
      title: "整理工作与行程信息",
      kind: "required",
      description:
        "准备项。整理雇主与职位信息、预计入境 / 离境日期、旅行目的与简短行程。",
    },
    statusProofTasks: [
      {
        id: "i797-evl",
        title: "I-797 批准通知与在职信",
        kind: "recommended",
        description:
          "本站建议（H-1B）。I-797 批准通知与雇主在职信（注明职位、入职时间、薪资）佐证在美工作身份与返美约束，非 IRCC 固定要求；在职信向公司 HR 索取。",
        detailPoints: [
          "美签贴纸已过期但身份有效（I-797 / I-94 在期）仍可正常申请 TRV：第三方经验是附一封身份解释信 + I-797 / I-94，并说明返美安排（如 AVR 自动重新生效政策）；此为经验做法、非官方要求。",
        ],
        sourceIds: ["uscis-i797"],
      },
      {
        id: "paystubs",
        title: "近期工资单",
        kind: "recommended",
        description:
          "本站建议（H-1B）。近 2–3 个月工资单佐证雇佣关系仍在持续，也可部分佐证资金状况。",
      },
      {
        id: "i94",
        title: "I-94 入境记录",
        kind: "recommended",
        description:
          "本站建议。佐证你在美合法停留；可在 CBP 官方站查询并打印最新记录与旅行史。",
        sourceIds: ["cbp-i94"],
      },
    ],
    canPlusPoint:
      "H-1B 与 CAN+（官方措辞的严格解读）：CAN+ 加速认的是护照上的「有效美国非移民签证」贴纸——H-1B 贴纸在有效期内即自动享受；贴纸已过期、仅 I-797 / I-94 身份有效时大概率不享受 CAN+ 加速（不影响申请资格），请按一般要求准备资金证明，最终以 IRCC Portal 个性化清单为准。",
  },
};

/** 资金证明的完整展开说明（常识勾选框不再逐条设问，细节集中在这里）。 */
function fundsDetailPoints(variant: IdentityVariant): string[] {
  return [
    "无官方固定金额：IRCC 只要求「有足够的钱覆盖停留」，金额取决于停留时长与住宿方式，由签证官按行程合理性裁量。",
    "自查基准（本站建议、非官方门槛）：往返机票 +（每日食宿交通杂费 × 停留天数）+ 一定缓冲，用来估算自己是否负担得起。",
    "常见证明形式：银行对账单（常见近 3 个月交易 + 近 6 个月余额，月数因签证办公室而异）、在职 / 雇主信、工资单；由他人资助则需资助方说明信 + 资助方流水 / 在职信 + 资助方证件复印件。",
    variant.canPlusPoint,
    "第三方经验（非官方、不构成获签保证）：有用户反馈美国账户约 3,000 USD 余额一般够用；金额因人、行程与政策而异。",
  ];
}

function buildSteps(variant: IdentityVariant): FlowStep[] {
  return [
    {
      id: "overview",
      slug: "overview",
      title: "了解流程与预计时间",
      milestone: "了解流程",
      summary:
        "先看清费用、全部节点与大致拿签时间，勾一次基本条件即可开始准备。",
      officialLinkIds: ["apply", "processing-times"],
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
            "访问目的为短期旅游或普通访问，结束后按时离开加拿大并返回美国。",
            "护照在有效期内，并计划用同一本护照申请与旅行；临近过期建议先续照。",
            "有明确的旅行计划（大致行程与日期）。",
            "能负担申请与旅行费用（金额口径与 F-1/H-1B 免交利好见「准备材料」步的资金证明项）。",
            "没有需要专业协助的犯罪、移民或健康复杂情况；如有拒签、犯罪记录或移民违规，本站流程不能替代专业意见，请先咨询合格专业人士。",
          ],
          sourceIds: ["eligibility"],
        },
        {
          id: "understand-timing",
          title: "我已按上方 ETA 为预约、审理和护照往返预留时间",
          kind: "recommended",
          description:
            "本站建议。提交不是终点；预约、审理、护照往返都需额外时间，按上方估算预留缓冲。",
        },
      ],
    },
    {
      id: "prepare",
      slug: "prepare",
      title: "准备信息与材料",
      milestone: "准备材料",
      summary:
        "提前整理官方会问的信息、备齐材料，并认识主申请表 IMM 5257；最终以系统生成的个性化清单为准。",
      officialLinkIds: ["apply", "imm5257-form"],
      tasks: [
        {
          id: "prep-passport-identity",
          title: "整理护照与身份信息",
          kind: "required",
          description:
            "准备项。整理当前与旧护照信息、美国住址与联系方式；本站不保存任何号码或地址。",
        },
        variant.itineraryTask,
        {
          id: "prep-background",
          title: "整理背景与既往申请记录",
          kind: "conditional",
          description:
            "视情况。整理教育 / 工作 / 旅行经历、家庭信息，以及既往加拿大申请、入境或拒签记录（如有须如实）。",
        },
        {
          id: "passport-copy",
          title: "护照资料页及有签证、印章或标记的页面",
          kind: "required",
          description:
            "官方要求。清晰彩色扫描护照资料页及有签注 / 印章页；常见遗漏是漏传旧签注页。最终以 Portal 个性化清单为准。",
          sourceIds: ["apply"],
        },
        {
          id: "imm5257",
          title: "认识主申请表 IMM 5257（按申请路径决定是否要填）",
          kind: "conditional",
          description:
            "视情况。走 IRCC secure account（GCKey）或纸质路径需要下载填写 IMM 5257 主表并验证条码；走 IRCC Portal 则直接在系统里答题、不用这个 PDF。展开看逐步要点。",
          detailPoints: [
            "下载入口：只用下方 IRCC 官方表格页的版本（2026-07 核验时为 2023-09 版，背景与声明问题已并入主表、无单独 Schedule 1），不要用第三方网站的模板。",
            "打开方式：先把 PDF 下载到电脑，再用 Adobe Acrobat Reader（版本 10 及以上）打开；直接在浏览器或系统预览里打开会填不了、也验证不了。",
            "填写：逐项如实填写全部必填项，与护照等证件完全一致；漏填必填项时验证会失败并提示。",
            "验证：填完点表上的「Validate」按钮，表尾会生成带条码的新页面——在线路径保存这份验证后的 PDF 备用，纸质路径打印后把条码页放在材料最上面。",
            "第三方经验：UCI 号（如有）在过往加签签证页右下角 Person 下方的黑体数字；在美国换发的中国护照，Country of issue 填中国、Place of Issue 填换发城市（如 Chicago）。",
            "第三方经验：Employment 是必填项，在读学生可写在读身份（如 Undergraduate student）、雇主栏填学校名称。",
            "现在只需下载并熟悉表格；实际是否要交、交到哪里，等下一步系统生成你的个性化清单后再确认。",
          ],
          sourceIds: ["imm5257-form", "validate-forms"],
        },
        ...variant.statusProofTasks,
        {
          id: "financial-proof",
          title: "资金证明",
          kind: "required",
          description:
            "官方要求。无官方固定金额；展开查看自查基准、证明形式与 CAN+（凭有效美签自动加速、材料常可简化）的说明。",
          detailPoints: fundsDetailPoints(variant),
          sourceIds: ["supporting-documents", "canplus"],
        },
        {
          id: "photo",
          title: "符合个性化清单要求的电子照片",
          kind: "conditional",
          description:
            "视情况。若 Portal 要求，需按官方尺寸、头部比例与背景规格上传；常见问题是尺寸或背景不合规。",
          sourceIds: ["photo-specs"],
        },
        {
          id: "extra-documents",
          title: "个性化清单要求的其他表格或补充材料",
          kind: "conditional",
          description:
            "视情况。以系统生成的个性化清单为准，可能包含额外表格或解释信。",
          detailPoints: [
            "第三方经验：常见被要求的补充项有中国居民身份证正反面扫描、旅行计划说明（大致日期地点即可，订单非必需）等；一切以你自己的清单为准。",
          ],
          sourceIds: ["apply"],
        },
      ],
    },
    {
      id: "apply",
      slug: "apply",
      title: "进入官方系统并在线填写",
      milestone: "在线填写",
      summary:
        "从官方入口进入，创建账户、回答问卷、拿到你的个性化清单；需要 IMM 5257 的路径按表格要点填写、验证并上传。",
      officialLinkIds: [
        "apply",
        "ircc-portal-process",
        "ircc-accounts",
        "imm5257-form",
      ],
      tasks: [
        {
          id: "official-entry",
          title: "从加拿大政府官方入口进入并创建 / 登录账户",
          kind: "required",
          description:
            "官方要求。务必从 canada.ca 的「How to apply」页进入，避免仿冒站点；展开看两条在线路径的区别与注册要点。本站不读取你的账户。",
          detailPoints: [
            "第 1 步：打开下方「访客签证申请步骤」官方页，按页面当前指引选择在线申请入口（入口偶有调整，以官方页面为准）。",
            "路径 A · IRCC Portal：按页面指引创建 Portal 账号后，直接在系统里逐屏回答申请问题，由系统生成申请——这条路径不需要下载 IMM 5257 PDF。",
            "路径 B · IRCC secure account（GCKey）：注册或登录 GCKey 账户 → 回答资格问卷 → 系统生成个性化材料清单 → 按清单上传文件（通常含验证过条码的 IMM 5257）。",
            "第三方经验：持有效美签者多走 Portal 简化路径——按官方页指引先获取邀请码再注册 Portal 账号，全程在系统里答题（居住地选美国、绿卡与美签状态如实选）。",
            "第三方经验：GCKey 路径的资格问卷会生成 reference code（约 60 天有效）；注册时设置的密保问题务必记牢，之后每次登录都要回答。",
            "注册账户只需邮箱和自设密保；官方系统不会通过邮件向你索要密码。",
          ],
          sourceIds: [
            "apply",
            "ircc-portal-process",
            "ircc-accounts",
            "ircc-portal-login",
          ],
        },
        {
          id: "visitor-visa",
          title: "确认申请类别选的是 visitor visa（访客签证）",
          kind: "required",
          description:
            "本站建议。问卷与申请类别处确认选择访客签证（TRV），避免误选学习 / 工作许可或 eTA 等其他类别。",
        },
        {
          id: "personal-checklist",
          title: "回答问卷，拿到系统生成的个性化材料清单",
          kind: "required",
          description:
            "官方要求。个性化清单基于你的问卷回答生成，是你这份申请的最终材料依据；展开看清单怎么用。",
          detailPoints: [
            "官方 FAQ：个性化清单适用于 secure account 与纸质申请，由资格问卷的回答生成；Portal 路径则直接在系统内答题。",
            "以清单为准核对表格与文件（而不是任何攻略清单，包括本站「准备材料」步）；缺什么回上一步补齐。",
            "清单要求 IMM 5257 时，用「准备材料」步表格任务里的要点填写验证。",
          ],
          sourceIds: ["personal-checklist-faq", "apply"],
        },
        {
          id: "upload-imm5257",
          title: "（GCKey 路径）验证并上传 IMM 5257",
          kind: "conditional",
          description:
            "视情况。个性化清单要求 IMM 5257 时：Adobe 填写 → 点 Validate 出条码页 → 保存后上传到清单对应位置；全部文件传完系统才会出现下一步。",
          detailPoints: [
            "官方要求：必填项没填全时 Validate 会失败；补全后再点，直到表尾出现条码页，保存这份验证后的 PDF 再上传。",
            "第三方经验：上传报错最常见的原因是没点 Validate、或用浏览器 / 系统预览填写；换 Adobe Acrobat Reader 重填并重新验证后再传。",
            "上传原始验证 PDF 即可，不要打印再扫描。",
          ],
          sourceIds: ["imm5257-form", "validate-forms"],
        },
        {
          id: "fill-truthfully",
          title: "逐项如实填写各部分表单",
          kind: "required",
          description:
            "官方填写项。如实填写旅行、个人与护照、美国身份、教育工作、财务、家庭与联系信息，且与证件完全一致。本站不复制问题、不代填答案。涉及拒签、犯罪或移民背景的问题必须如实回答。",
        },
      ],
    },
    {
      id: "submit",
      slug: "submit",
      title: "上传、核对、缴费并提交",
      milestone: "提交缴费",
      summary: "提交前完成最后核对，并保存确认页和收据。",
      officialLinkIds: ["apply", "fees"],
      timelineEvents: [
        {
          id: "applicationSubmittedAt",
          label: "在线提交日期",
          description: "记录日期用于计算你自己的流程耗时与 ETA。",
        },
      ],
      tasks: [
        {
          id: "all-files-uploaded",
          title: "已上传个性化清单要求的全部文件",
          kind: "required",
          description:
            "官方要求。按 Portal 清单逐项上传；常见遗漏是漏传清单中的某一项。",
        },
        {
          id: "details-match",
          title: "文件清晰且表单与证件一致",
          kind: "required",
          description:
            "本站建议。提交前核对姓名、号码、日期与文件清晰度 / 方向；部分系统对单文件大小有限制，过大需压缩。",
          detailPoints: [
            "第三方经验：单文件超限时把扫描分辨率压到 96dpi 左右通常即可通过；以系统提示的格式与大小要求为准。",
          ],
        },
        {
          id: "declaration-read",
          title: "已阅读声明并完成官方电子签署",
          kind: "required",
          description: "官方要求。需阅读并电子签署声明方可提交。",
        },
        {
          id: "fees-paid",
          title: "已按官方页面显示金额缴费",
          kind: "required",
          description:
            "官方要求。按 IRCC 页面显示金额在线缴费，包含申请费及（如适用）生物信息费。",
          detailPoints: [
            "第三方整理：在线缴费支持 Visa / MasterCard / Amex / JCB / 银联等主流信用卡，以支付页实际显示为准；自 2023-04 起申请费仅接受在线支付。",
          ],
          sourceIds: ["fees"],
        },
        {
          id: "confirmation-saved",
          title: "已保存提交确认和缴费收据",
          kind: "recommended",
          description: "本站建议。保存确认页与收据，以备后续查询。",
        },
      ],
    },
    {
      id: "biometrics",
      slug: "biometrics",
      title: "预约并完成生物信息采集",
      milestone: "生物采集",
      summary: "查看是否需要采集；如需采集，按 BIL 期限在美预约并完成。",
      officialLinkIds: ["need-biometrics", "biometrics-where"],
      deadline: {
        chip: "限 30 天",
        note: "收到 BIL 信后 30 天内完成采集；无法按时可通过官方网表申请延期",
        eventId: "biometricsLetterReceivedAt",
        days: 30,
      },
      timelineEvents: [
        {
          id: "biometricsLetterReceivedAt",
          label: "收到 BIL 日期",
          description: "如无需采集，可以留空。",
        },
        {
          id: "biometricsCompletedAt",
          label: "完成生物信息采集日期",
          description: "如官方确认无需采集，可以留空。",
        },
      ],
      tasks: [
        {
          id: "check-account",
          title: "定期查看 IRCC 账户和邮箱",
          kind: "required",
          description:
            "官方要求。提交后通过账户与邮箱接收生物信息指示信（BIL）及任何通知。",
        },
        {
          id: "bil-status",
          title: "已确认是否需要采集并是否收到 BIL",
          kind: "required",
          description:
            "官方要求。14–79 岁通常需采集；可先用官方工具确认是否需要，并确认是否收到 BIL。既往生物信息 10 年内有效者可能无需再次采集。",
          sourceIds: ["need-biometrics"],
        },
        {
          id: "bil-deadline",
          title: "已阅读 BIL 中的地点和截止日期",
          kind: "required",
          description:
            "官方要求。一般需在 BIL 标注日期起 30 天内完成采集；无法按时可通过官方网表申请延期。若官方确认无需采集，可标记不适用。",
          sourceIds: ["need-biometrics"],
          allowNotApplicable: true,
        },
        {
          id: "appointment-booked",
          title: "已通过官方入口预约采集点",
          kind: "required",
          description:
            "官方要求。在美国一般到 USCIS ASC 采集（预约免费）；放号窗口有限，收到 BIL 后尽快预约。若无需采集，可标记不适用。",
          detailPoints: [
            "第三方经验：ASC 官方预约系统通常只放出约两周后的号，收到 BIL 当天就去约；部分城市的 VAC 也可采集。",
            "第三方经验：个别 ASC 有 walk-in（免预约）成功案例，但政策随时变、各点差异大，出发前多看近期社区反馈，并以现场为准。",
          ],
          sourceIds: ["biometrics-where"],
          allowNotApplicable: true,
        },
        {
          id: "biometrics-done",
          title: "已完成指纹和照片采集",
          kind: "required",
          description:
            "官方要求。携护照与 BIL 现场完成采集，之后留意账户状态更新。若官方确认无需采集，可标记不适用。",
          sourceIds: ["biometrics-where"],
          allowNotApplicable: true,
        },
      ],
    },
    {
      id: "decision",
      slug: "decision",
      title: "等待审理并递交护照",
      milestone: "递签护照",
      summary: "继续查看账户；收到护照递交通知后，按 VFS 当前要求递交并跟踪。",
      officialLinkIds: ["after-apply", "vfs-passport", "processing-times"],
      deadline: {
        chip: "限期寄达",
        note: "收到护照递交通知（PPR / OPR）后，须在通知标注的截止日期前寄达护照（第三方经验：通常约 30 天）",
        eventId: "passportRequestReceivedAt",
      },
      timelineEvents: [
        {
          id: "passportRequestReceivedAt",
          label: "收到护照递交通知日期",
          description: "以 IRCC 账户内正式通知日期为准。",
        },
        {
          id: "passportSubmittedAt",
          label: "寄出或递交护照日期",
          description: "用于估算贴签与返还阶段耗时。",
        },
        {
          id: "passportReturnShippedAt",
          label: "护照开始返还日期",
          description: "如能从追踪信息确认，可记录该日期。",
        },
      ],
      tasks: [
        {
          id: "monitor-status",
          title: "定期查看 IRCC 账户和邮箱",
          kind: "required",
          description:
            "官方要求。审理期间通过账户与邮箱接收通知；处理时间为参考、不含生物信息与邮寄，不代表批准保证。",
          detailPoints: [
            "第三方经验：顺利案例从提交到收回护照约 2–3 周；「提交 → BIL」「采集 → 护照递交通知」各自从 1 天到 1 个月的波动都属正常，不代表申请出了问题。",
          ],
          sourceIds: ["processing-times"],
        },
        {
          id: "additional-request",
          title: "如收到额外要求，已按通知处理",
          kind: "conditional",
          description:
            "视情况。可能收到补件、面试或体检要求，按官方通知与截止日期处理。",
        },
        {
          id: "official-ppr",
          title: "收到正式护照递交通知（PPR）后再寄护照",
          kind: "required",
          description:
            "官方要求。仅在收到正式护照递交通知后再寄，注意截止日期，并使用申请时同一本护照；提前寄出有风险。",
          sourceIds: ["after-apply"],
        },
        {
          id: "vfs-submit",
          title: "按 VFS 美国站当前要求递交护照",
          kind: "required",
          description:
            "官方要求。递交护照原件 + PPR + 同意书 + 服务费 + 回邮安排；VFS 为 IRCC 授权第三方运营商，地址 / 费用 / 快递方式以其官网当前页面为准，勿按旧攻略准备。",
          detailPoints: [
            "第三方经验：递交通知信即 OPR（IMM 5740）；递交包通常为 OPR 信 + 护照原件 + 同意书 + 转运费 + 回邮安排。",
            "第三方经验：转运费用 money order / cashier's check 支付、抬头写 VFS Services (USA) Inc.，个人与公司支票都不收；金额以 VFS 当前页面为准。",
            "第三方经验：在 VAC 录过指纹并在同一 VAC 递交护照可免转运费；多人可合并寄送，但回邮 label 一人一份。",
          ],
          sourceIds: ["vfs-passport"],
        },
        {
          id: "vfs-track",
          title: "保存追踪信息并确认签收与返还",
          kind: "recommended",
          description:
            "本站建议。保存快递单号与收据，确认 VAC 签收并跟踪护照开始返还；无需向本站填写任何申请号。",
          sourceIds: ["vfs-passport"],
        },
      ],
    },
    {
      id: "complete",
      slug: "complete",
      title: "收到护照并核对签证",
      milestone: "收到签证",
      summary: "核对签证信息，完成本站申请流程。",
      officialLinkIds: ["visitor-overview"],
      timelineEvents: [
        {
          id: "passportReceivedAt",
          label: "收到护照日期",
          description: "用于计算从提交申请到收到护照的总耗时。",
        },
      ],
      tasks: [
        {
          id: "passport-received",
          title: "已收到护照且没有运输损坏",
          kind: "required",
          description: "进度确认。收到后先检查外包装与护照是否运输受损。",
        },
        {
          id: "visa-details-checked",
          title: "签证姓名、护照号、类别与有效期已核对",
          kind: "required",
          description:
            "本站建议。核对签证姓名 / 护照号 / 类别 / 入境次数 / 有效期与护照一致，有疑问及时联系官方。",
        },
        {
          id: "records-saved",
          title: "已保存申请收据和决定记录",
          kind: "recommended",
          description: "本站建议。留存收据与决定记录备查。",
        },
        {
          id: "timeline-reviewed",
          title: "已回顾各阶段日期",
          kind: "recommended",
          description:
            "本站建议。回顾本地记录的各阶段日期是否准确，便于估算自己的耗时；本站不上传、不收集姓名 / UCI / 申请号。",
        },
      ],
    },
  ];
}

export function buildCaTrvFlow(identity: SupportedIdentityCode): FlowConfig {
  const variant = identityVariants[identity];

  return {
    id: `ca-trv-${variant.statusSlug}`,
    version: "0.3",
    countryCode: "CA",
    countrySlug: "ca",
    countryName: "加拿大",
    countryFlag: "🇨🇦",
    visaType: "访客签证（TRV）",
    visaTypeSlug: "visitor",
    status: identity,
    statusSlug: variant.statusSlug,
    statusLabel: variant.statusLabel,
    audience: variant.audience,
    nationality: {
      label: "中国普通护照",
      slug: "cn-ordinary",
      note: "中国普通护照前往加拿大需贴签访客签证（TRV），而非 eTA。其他国籍是否需要签证或 eTA 不同，请用官方判断工具确认。",
    },
    lastVerified: "2026-07-09",
    officialFee:
      "每人 CAD 100；家庭（5 人及以上同时申请）最高 CAD 500，以提交时 IRCC 费用页为准",
    biometricsFee:
      "每人 CAD 85；家庭（2 人及以上同时申请）最高 CAD 170。14–79 岁通常需采集，以 IRCC 页面为准",
    feeItems: [
      {
        id: "application-fee",
        label: "签证申请费",
        amount: 100,
        currency: "CAD",
        note: "每人；家庭（5 人及以上同时申请）最高 CAD 500",
      },
      {
        id: "biometrics-fee",
        label: "生物信息费",
        amount: 85,
        currency: "CAD",
        note: "每人；家庭（2 人及以上）最高 CAD 170；14–79 岁通常需采集，既往采集 10 年内有效者可能免缴",
      },
    ],
    etaStages: [
      {
        id: "submit-to-bil",
        label: "交申请 → 收到生物信息采集信（BIL）",
        minDays: 2,
        maxDays: 14,
        basis: "experience",
        note: "个别可达约 30 天；真实经验有 2 天案例。",
      },
      {
        id: "biometrics-complete",
        label: "完成生物信息采集（指纹 + 照片）",
        minDays: 3,
        maxDays: 14,
        basis: "experience",
        sourceId: "need-biometrics",
        note: "官方要求收到 BIL 起 30 天内完成；既往生物信息 10 年内有效者可能无需采集。",
      },
      {
        id: "review-to-ppr",
        label: "审理 → 收到护照递交通知（PPR）",
        minDays: 7,
        maxDays: 21,
        basis: "official",
        sourceId: "processing-times",
        note: "官方处理时间每周更新、按申请来源国不同，实际以官方查询工具当日显示为准，可能更长。",
      },
      {
        id: "passport-roundtrip",
        label: "寄出护照 → 收回贴签护照",
        minDays: 7,
        maxDays: 10,
        basis: "experience",
        sourceId: "vfs-passport",
        note: "含购买 VFS 回邮 label 的缓冲；以承运商与 VFS 当前要求为准。",
      },
    ],
    processingTimeSourceId: "processing-times",
    sources: [
      {
        id: "visitor-overview",
        label: "加拿大访客签证说明",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/about-visitor-visa.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "check-visa-eta",
        label: "是否需要签证或 eTA 官方判断工具",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/check-visa-eta.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "entry-requirements",
        label: "各国籍入境要求",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "eligibility",
        label: "访客签证申请资格",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eligibility.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "supporting-documents",
        label: "访客签证支持文件与资金证明说明",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/supporting-documents.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "canplus",
        label: "CAN+ 便利计划（自动加速审理，材料常可简化）",
        organization: IRCC,
        url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=877&top=16",
        lastVerified: "2026-07-07",
      },
      {
        id: "apply",
        label: "访客签证申请步骤与个性化清单",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "imm5257-form",
        label: "IMM 5257 主申请表官方下载页（访客签证）",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/imm5257.html",
        lastVerified: "2026-07-09",
      },
      {
        id: "validate-forms",
        label: "如何填写并验证带条码的申请表（官方 FAQ）",
        organization: IRCC,
        url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523&top=4",
        lastVerified: "2026-07-09",
      },
      {
        id: "personal-checklist-faq",
        label: "什么是个性化材料清单（官方 FAQ）",
        organization: IRCC,
        url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=829&top=29",
        lastVerified: "2026-07-09",
      },
      {
        id: "ircc-portal-process",
        label: "IRCC Portal 在线申请流程说明",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/portal-application-process.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "ircc-accounts",
        label: "IRCC 账户与登录入口说明",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/accounts.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "ircc-portal-login",
        label: "IRCC Portal 登录 / 创建账户",
        organization: IRCC,
        url: "https://ircc-services.canada.ca/cxp/s/login/",
        lastVerified: "2026-06-25",
      },
      {
        id: "fees",
        label: "移民与签证费用清单",
        organization: IRCC,
        url: "https://ircc.canada.ca/english/information/fees/fees.asp",
        lastVerified: "2026-06-25",
      },
      {
        id: "photo-specs",
        label: "访客签证照片官方规格",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/temporary-resident-visa-application-photograph-specifications.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "need-biometrics",
        label: "是否需要采集生物信息工具",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/biometrics/need-biometrics.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "biometrics-where",
        label: "生物信息采集地点（在美走 USCIS ASC）",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/biometrics/where-to-give.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "processing-times",
        label: "官方处理时间查询",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "after-apply",
        label: "提交申请后的官方流程",
        organization: IRCC,
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/after-apply-next-steps.html",
        lastVerified: "2026-06-25",
      },
      {
        id: "vfs-passport",
        label: "美国 → 加拿大护照递交（VFS）",
        organization: VFS,
        url: "https://visa.vfsglobal.com/usa/en/can/passport-submission",
        lastVerified: "2026-06-25",
      },
      {
        id: "cbp-i94",
        label: "I-94 在线查询与打印",
        organization: CBP,
        url: "https://i94.cbp.dhs.gov/",
        lastVerified: "2026-06-25",
      },
      {
        id: "i20-info",
        label: "如何获取 I-20（由学校 DSO 签发，无自助下载）",
        organization: SEVP,
        url: "https://studyinthestates.dhs.gov/students/get-your-form-i-20",
        lastVerified: "2026-06-25",
      },
      {
        id: "uscis-i797",
        label: "I-797 批准通知说明",
        organization: USCIS,
        url: "https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions",
        lastVerified: "2026-07-07",
      },
    ],
    steps: buildSteps(variant),
  };
}

export const caTrvF1Flow = buildCaTrvFlow("F1");
export const caTrvH1bFlow = buildCaTrvFlow("H1B");
