import type { FlowConfig } from "@/lib/flow-types";

const IRCC = "加拿大移民、难民及公民部（IRCC）";
const CBP = "美国海关与边境保护局（CBP）";
const SEVP = "美国 SEVP / 国土安全部（DHS）";
const VFS = "VFS Global（IRCC 授权服务商，非政府机构）";

export const caTrvF1Flow: FlowConfig = {
  id: "ca-trv-f1-adult",
  version: "0.2",
  countryCode: "CA",
  countrySlug: "ca",
  countryName: "加拿大",
  visaType: "访客签证（TRV）",
  visaTypeSlug: "visitor",
  status: "F1",
  statusSlug: "f1",
  statusLabel: "F-1 在读学生",
  audience: "持中国普通护照、年满 18 岁、目前以 F-1 身份在美国学习的申请人",
  nationality: {
    label: "中国普通护照",
    slug: "cn-ordinary",
    note: "中国普通护照前往加拿大需贴签访客签证（TRV），而非 eTA。其他国籍是否需要签证或 eTA 不同，请用官方判断工具确认。",
  },
  lastVerified: "2026-06-25",
  officialFee:
    "每人 CAD 100；家庭（5 人及以上同时申请）最高 CAD 500，以提交时 IRCC 费用页为准",
  biometricsFee:
    "每人 CAD 85；家庭（2 人及以上同时申请）最高 CAD 170。14–79 岁通常需采集，以 IRCC 页面为准",
  eligibilityChoices: [
    { id: "F1", label: "F-1 在读学生", supported: true, note: "0.1 版本支持" },
    { id: "OPT", label: "OPT / STEM OPT", supported: false, note: "后续版本" },
    { id: "H", label: "H 类身份", supported: false, note: "后续版本" },
    { id: "J", label: "J 类身份", supported: false, note: "后续版本" },
    { id: "M", label: "M 类身份", supported: false, note: "后续版本" },
    { id: "L", label: "L 类身份", supported: false, note: "后续版本" },
  ],
  eligibilityConditions: [
    {
      id: "chinese-passport",
      label: "我持中国普通护照",
      unsupportedHint:
        "其他国籍是否需要签证或 eTA 不同，请用官方判断工具确认所需的入境文件。",
    },
    {
      id: "in-us",
      label: "我目前人在美国",
      unsupportedHint:
        "本流程面向在美国境内申请；在其他国家请以当地加拿大签证申请中心为准。",
    },
    {
      id: "f1-active",
      label: "我是 F-1 在读学生（不是 OPT）",
      unsupportedHint:
        "OPT、STEM OPT、F-2 等身份的材料差异留待后续版本，请勿套用本流程。",
    },
    {
      id: "adult",
      label: "我已年满 18 岁",
      unsupportedHint:
        "未成年人通常需要额外的监护与同意文件，本版本暂未覆盖。",
    },
    {
      id: "new-application",
      label: "我要提交一份新的加拿大访客签证申请",
      unsupportedHint:
        "已在他处递交、仅需在美贴签的情况暂不覆盖，请以官方通知为准。",
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
      label: "CAN+ 便利计划（持有效美签通常可免交资金证明）",
      organization: IRCC,
      url: "https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=877&top=16",
      lastVerified: "2026-06-25",
    },
    {
      id: "apply",
      label: "访客签证申请步骤与个性化清单",
      organization: IRCC,
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html",
      lastVerified: "2026-06-25",
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
  ],
  steps: [
    {
      id: "eligibility",
      slug: "eligibility",
      title: "检查基本申请条件",
      summary: "确认你大致符合标准访客签证流程；本站不代替 IRCC 作资格判断。",
      officialLinkIds: ["eligibility", "supporting-documents", "canplus"],
      tasks: [
        {
          id: "valid-passport",
          title: "护照有效，并计划使用同一本护照申请和旅行",
          kind: "required",
          description:
            "官方要求。需持有效旅行证件并用同一本护照申请与旅行；临近过期建议先续照。",
          sourceIds: ["eligibility"],
        },
        {
          id: "short-visit",
          title: "访问目的为短期旅游或普通访问",
          kind: "required",
          description:
            "本站建议。0.1 面向普通短期访问；商务、就医、人道等特殊目的可能有不同要求。",
        },
        {
          id: "leave-canada",
          title: "我计划在访问结束后离开加拿大",
          kind: "required",
          description:
            "官方要求。签证官需相信你会在停留结束后离开，这是 TRV 评估的核心之一。",
          sourceIds: ["eligibility"],
        },
        {
          id: "enough-funds",
          title: "我能够承担申请和旅行费用",
          kind: "required",
          description:
            "官方要求。需有足够资金覆盖停留与往返；加拿大访客签证无官方固定金额，展开看自查基准与 F-1 免交利好。",
          detailPoints: [
            "无官方固定金额：IRCC 只要求「有足够的钱覆盖停留」，金额取决于停留时长与住宿方式，由签证官按行程合理性裁量。",
            "自查基准（本站建议、非官方门槛）：往返机票 +（每日食宿交通杂费 × 停留天数）+ 一定缓冲，用来估算自己是否负担得起。",
            "常见证明形式：银行对账单（常见近 3 个月交易 + 近 6 个月余额，月数因签证办公室而异）、在职 / 雇主信、工资单；由他人资助则需资助方说明信 + 资助方流水 / 在职信 + 资助方证件复印件。",
            "F-1 利好（官方 CAN+）：持有效美国非移民签证（F-1 符合）通常可不单独提交资金证明，仅凭有效美签即可；但「可不交」不等于「不需要具备」，签证官保留补件权，且仅适用访客签证。",
            "第三方经验（非官方、不构成获签保证）：有用户反馈美国账户约 3,000 USD 余额一般够用；金额因人、行程与政策而异。",
          ],
          sourceIds: ["eligibility", "supporting-documents", "canplus"],
        },
        {
          id: "study-ties",
          title: "我能说明在美国的学习安排和返回约束",
          kind: "recommended",
          description:
            "本站建议。在读身份与返美约束有助于体现离境意图；非官方硬性材料，但常被建议准备。",
        },
        {
          id: "complex-case",
          title: "我没有需要专业协助的复杂犯罪、移民或健康情况",
          kind: "conditional",
          description:
            "视情况。若有拒签、犯罪、移民违规或健康问题，本站流程不能替代专业意见，请谨慎如实处理。",
        },
      ],
    },
    {
      id: "overview",
      slug: "overview",
      title: "了解流程与预计时间",
      summary: "先看清费用、全周期与大致拿签时间，再开始准备。",
      officialLinkIds: ["apply", "processing-times"],
      showSummaryPanel: true,
      showEtaEstimator: true,
      tasks: [
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
      summary: "提前整理官方会问的信息并备齐材料；最终以 IRCC Portal 个性化清单为准。",
      officialLinkIds: ["apply"],
      tasks: [
        {
          id: "prep-passport-identity",
          title: "整理护照与身份信息",
          kind: "required",
          description:
            "准备项。整理当前与旧护照信息、美国住址与联系方式；本站不保存任何号码或地址。",
        },
        {
          id: "prep-study-travel",
          title: "整理学习与行程信息",
          kind: "required",
          description:
            "准备项。整理学校在读信息、预计入境 / 离境日期、旅行目的与简短行程。",
        },
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
        {
          id: "financial-proof",
          title: "资金证明",
          kind: "required",
          description:
            "官方要求。金额口径、证明形式与 F-1 的 CAN+ 免交说明见「检查基本申请条件」中的资金项；持有效美签者常可凭美签免交。",
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
          title: "Portal 要求的其他表格或补充材料",
          kind: "conditional",
          description:
            "视情况。以 IRCC Portal 生成的个性化清单为准，可能包含额外表格或解释信。",
          sourceIds: ["apply"],
        },
      ],
    },
    {
      id: "apply",
      slug: "apply",
      title: "进入官方系统并在线填写",
      summary: "从官方入口进入 IRCC Portal，按个性化清单逐项如实填写。",
      officialLinkIds: ["ircc-portal-process", "ircc-accounts"],
      tasks: [
        {
          id: "official-entry",
          title: "我从加拿大政府官方入口进入并登录 IRCC Portal",
          kind: "required",
          description:
            "官方要求。务必从 canada.ca 官方入口进入并登录，避免仿冒站点；可能存在不同账户 / Portal 路径，按官方当前指引选择。本站不读取你的账户。",
          sourceIds: ["ircc-portal-process", "ircc-accounts", "ircc-portal-login"],
        },
        {
          id: "visitor-visa",
          title: "我确认选择的是 visitor visa（访客签证）",
          kind: "required",
          description:
            "本站建议。确认申请类别为访客签证（TRV），避免误选其他许可类别。",
        },
        {
          id: "personal-checklist",
          title: "我已查看系统生成的个性化材料清单",
          kind: "required",
          description:
            "官方要求。Portal 会生成个性化文件清单，这是最终材料依据，应以它为准而非任何攻略清单。",
          sourceIds: ["apply"],
        },
        {
          id: "fill-truthfully",
          title: "逐项如实填写各部分表单",
          kind: "required",
          description:
            "官方填写项。如实填写旅行、个人与护照、美国身份、教育工作、财务、家庭与联系信息，且与证件完全一致。本站不复制问题、不代填答案。",
        },
        {
          id: "background-honesty",
          title: "安全、医疗和移民背景问题如实回答",
          kind: "required",
          description:
            "官方填写项。涉及拒签、犯罪或移民违规等问题必须如实回答；不确定时查看官方说明或咨询合格专业人士。",
        },
      ],
    },
    {
      id: "submit",
      slug: "submit",
      title: "上传、核对、缴费并提交",
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
      title: "生物信息采集",
      summary: "查看是否需要采集；如需采集，按 BIL 期限在美预约并完成。",
      officialLinkIds: ["need-biometrics", "biometrics-where"],
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
            "官方要求。14–79 岁通常需采集；可先用官方工具确认是否需要，并确认是否收到 BIL。",
          sourceIds: ["need-biometrics"],
        },
        {
          id: "biometrics-validity",
          title: "已核对既往生物信息有效性",
          kind: "conditional",
          description:
            "视情况。既往生物信息有效期 10 年，若仍有效可能无需再次采集，以官方工具与你的通知为准。",
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
      summary: "继续查看账户；收到护照递交通知后，按 VFS 当前要求递交并跟踪。",
      officialLinkIds: ["after-apply", "vfs-passport", "processing-times"],
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
  ],
};
