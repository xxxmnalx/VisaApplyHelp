import type { FlowConfig } from "@/lib/flow-types";

export const caTrvF1Flow: FlowConfig = {
  id: "ca-trv-f1-adult",
  version: "0.1",
  countryCode: "CA",
  countrySlug: "ca",
  countryName: "加拿大",
  visaType: "访客签证（TRV）",
  visaTypeSlug: "visitor",
  status: "F1",
  statusSlug: "f1",
  statusLabel: "F-1 在读学生",
  audience: "持中国护照、年满 18 岁、目前以 F-1 身份在美国学习的申请人",
  lastVerified: "2026-06-24",
  officialFee: "每人 CAD 100；家庭（5 人及以上同时申请）最高 CAD 500，以提交时 IRCC 费用页为准",
  biometricsFee:
    "每人 CAD 85；家庭（2 人及以上同时申请）最高 CAD 170。14–79 岁通常需采集，以 IRCC 页面为准",
  eligibilityChoices: [
    {
      id: "F1",
      label: "F-1 在读学生",
      supported: true,
      note: "0.1 版本支持",
    },
    {
      id: "OPT",
      label: "OPT / STEM OPT",
      supported: false,
      note: "后续版本",
    },
    {
      id: "H",
      label: "H 类身份",
      supported: false,
      note: "后续版本",
    },
    {
      id: "J",
      label: "J 类身份",
      supported: false,
      note: "后续版本",
    },
    {
      id: "M",
      label: "M 类身份",
      supported: false,
      note: "后续版本",
    },
    {
      id: "L",
      label: "L 类身份",
      supported: false,
      note: "后续版本",
    },
  ],
  sources: [
    {
      id: "visitor-overview",
      label: "加拿大访客签证说明",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/about-visitor-visa.html",
      lastVerified: "2026-06-23",
    },
    {
      id: "eligibility",
      label: "访客签证申请资格",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eligibility.html",
      lastVerified: "2026-06-24",
    },
    {
      id: "apply",
      label: "访客签证申请步骤与官方入口",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html",
      lastVerified: "2026-06-23",
    },
    {
      id: "fees",
      label: "移民与签证费用清单",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://ircc.canada.ca/english/information/fees/fees.asp",
      lastVerified: "2026-06-24",
    },
    {
      id: "account",
      label: "IRCC 账户入口说明",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html",
      lastVerified: "2026-06-23",
    },
    {
      id: "biometrics",
      label: "生物信息采集要求与地点",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/biometrics/where-to-give.html",
      lastVerified: "2026-06-24",
    },
    {
      id: "after-apply",
      label: "提交申请后的官方流程",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/after-apply-next-steps.html",
      lastVerified: "2026-06-23",
    },
    {
      id: "processing-times",
      label: "官方处理时间查询",
      organization: "加拿大移民、难民及公民部（IRCC）",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html",
      lastVerified: "2026-06-23",
    },
    {
      id: "vfs-us",
      label: "美国加拿大签证申请中心",
      organization: "VFS Global",
      url: "https://visa.vfsglobal.com/usa/en/can/",
      lastVerified: "2026-06-23",
    },
  ],
  steps: [
    {
      id: "identity",
      slug: "identity",
      title: "确认身份与适用范围",
      summary: "先确认这条 F-1 流程是否适合你，再开始准备材料。",
      officialLinkIds: ["visitor-overview"],
      tasks: [
        {
          id: "chinese-passport",
          title: "我持中国普通护照",
          kind: "required",
          description:
            "本站要求。本流程只为中国普通护照持有人设计；持其他旅行证件请以对应规则为准。",
        },
        {
          id: "in-us",
          title: "我目前人在美国",
          kind: "required",
          description:
            "本站要求。流程假设你从美国境内在线申请，并在美国完成生物信息采集与护照递交。",
        },
        {
          id: "f1-active",
          title: "我目前是 F-1 在读学生，不是 OPT",
          kind: "required",
          description:
            "本站要求。0.1 只覆盖在读 F-1；OPT、STEM OPT、F-2 的材料差异留待后续版本。",
        },
        {
          id: "adult",
          title: "我已年满 18 岁",
          kind: "required",
          description:
            "本站要求。未成年人通常需要额外的监护与同意文件，0.1 暂不覆盖。",
        },
        {
          id: "new-application",
          title: "我准备提交一份新的加拿大访客签证申请",
          kind: "required",
          description:
            "本站要求。本流程针对从零开始的新申请；已在中国递交、仅需在美贴签的情况不适用。",
        },
      ],
    },
    {
      id: "eligibility",
      slug: "eligibility",
      title: "检查基本申请条件",
      summary: "发现明显不适合标准流程的情况；本站不代替 IRCC 作资格判断。",
      officialLinkIds: ["eligibility"],
      tasks: [
        {
          id: "valid-passport",
          title: "护照有效，并计划使用同一本护照申请和旅行",
          kind: "required",
          description:
            "官方要求。IRCC 要求持有效旅行证件，并用同一本护照贴签和旅行；临近过期建议先续照。",
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
          id: "study-ties",
          title: "我能说明在美国的学习安排和返回约束",
          kind: "recommended",
          description:
            "本站建议。在读身份与返美约束有助于体现离境意图；非官方硬性材料，但常被建议准备。",
        },
        {
          id: "enough-funds",
          title: "我能够承担申请和旅行费用",
          kind: "required",
          description:
            "官方要求。IRCC 要求有足够资金支付停留与往返；金额不固定，准备能覆盖行程的证明即可。",
          sourceIds: ["eligibility"],
        },
        {
          id: "complex-case",
          title: "我没有需要专业协助的复杂犯罪、移民或健康情况",
          kind: "conditional",
          description:
            "视情况。若存在拒签、犯罪、移民违规或健康问题，本站流程不能替代专业意见，请谨慎如实处理。",
        },
      ],
    },
    {
      id: "overview",
      slug: "overview",
      title: "了解完整流程",
      summary: "先看清申请、指纹、审理和贴签全周期，避免只规划 IRCC 审理时间。",
      officialLinkIds: ["apply", "processing-times"],
      tasks: [
        {
          id: "understand-online",
          title: "我知道本流程需要在线申请",
          kind: "informational",
          description: "本站说明。0.1 只覆盖 IRCC 在线申请路径，不含纸质申请。",
        },
        {
          id: "understand-fees",
          title: "我已了解申请费和可能的生物信息费",
          kind: "informational",
          description:
            "官方信息。访客签证申请费按人收取，14–79 岁通常另需缴纳生物信息费；金额以提交时 IRCC 费用页为准。",
          sourceIds: ["fees"],
        },
        {
          id: "understand-timing",
          title: "我已为预约、审理和护照往返预留时间",
          kind: "recommended",
          description:
            "本站建议。提交不是终点；生物信息预约、审理、护照寄递都需额外时间，建议留足缓冲。",
        },
        {
          id: "understand-no-guarantee",
          title: "我理解处理时间不是批准保证或最长时限",
          kind: "required",
          description:
            "官方信息。IRCC 公布的处理时间是参考，不代表一定获批或一定在该期限内完成。",
          sourceIds: ["processing-times"],
        },
      ],
    },
    {
      id: "information",
      slug: "information",
      title: "准备个人与旅行信息",
      summary: "提前整理官方表格会询问的信息；本站不会保存具体答案。",
      officialLinkIds: ["apply"],
      tasks: [
        {
          id: "passport-info",
          title: "当前及旧护照信息",
          kind: "required",
          description:
            "准备项。官方表格会询问护照与既往护照信息；本站只列提示，不保存任何号码。",
        },
        {
          id: "us-address",
          title: "美国住址和联系方式",
          kind: "required",
          description: "准备项。用于联系与身份信息填写；本站不保存具体地址。",
        },
        {
          id: "school-info",
          title: "学校及当前学习信息",
          kind: "required",
          description:
            "准备项。F-1 在读情况有助于说明在美约束；本站不保存学校名称。",
        },
        {
          id: "travel-plan",
          title: "预计旅行日期、目的和简短行程",
          kind: "required",
          description:
            "准备项。在线表格会询问行程；提前想清楚入境与离境安排可减少反复修改。",
        },
        {
          id: "history-info",
          title: "教育、工作和旅行经历",
          kind: "required",
          description: "准备项。背景信息需与证明文件一致，时间线避免缺口或矛盾。",
        },
        {
          id: "family-info",
          title: "配偶、子女和父母等家庭信息",
          kind: "required",
          description: "准备项。表格通常要求家庭成员信息，提前整理可加快填写。",
        },
        {
          id: "application-history",
          title: "既往加拿大申请、入境和拒签记录",
          kind: "conditional",
          description:
            "视情况。如有相关记录必须如实回答；遗漏或不实可能影响结果。",
        },
      ],
    },
    {
      id: "documents",
      slug: "documents",
      title: "准备申请材料",
      summary: "最终以 IRCC Portal 生成的个性化文件清单为准。",
      officialLinkIds: ["apply"],
      tasks: [
        {
          id: "passport-copy",
          title: "护照资料页及有签证、印章或标记的页面",
          kind: "required",
          description:
            "官方要求。需清晰彩色扫描资料页及有签注、印章的页面；常见遗漏是漏传旧签注页或扫描模糊。最终以 Portal 个性化清单为准。",
          sourceIds: ["apply"],
        },
        {
          id: "i20",
          title: "有效 I-20",
          kind: "required",
          description:
            "本站建议（F-1）。用于佐证在读身份与返美约束，非 IRCC 固定要求；确保签字与有效期清晰可读。",
        },
        {
          id: "i94",
          title: "I-94 入境记录",
          kind: "recommended",
          description:
            "本站建议。可佐证你在美合法停留；从 CBP 官网下载最新记录即可。",
        },
        {
          id: "enrollment-letter",
          title: "学校在读证明",
          kind: "recommended",
          description: "本站建议。强化在读与离境意图；非官方硬性材料。",
        },
        {
          id: "itinerary",
          title: "旅行目的和行程说明",
          kind: "recommended",
          description:
            "本站建议。一份简短行程能帮助说明访问目的；无需过度详细或伪造预订。",
        },
        {
          id: "financial-proof",
          title: "资金证明",
          kind: "required",
          description:
            "官方要求。需证明能负担停留与往返费用；金额不固定，常见遗漏是只给余额截图而缺乏可信来源说明。",
          sourceIds: ["apply"],
        },
        {
          id: "photo",
          title: "符合个性化清单要求的电子照片",
          kind: "conditional",
          description:
            "视情况。若 Portal 要求，需按官方尺寸与格式上传；常见问题是尺寸或背景不合规。",
          sourceIds: ["apply"],
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
      id: "account",
      slug: "account",
      title: "进入 IRCC 官方系统",
      summary: "从加拿大政府页面选择当前适用的 Portal 或账户入口。",
      officialLinkIds: ["apply", "account"],
      tasks: [
        {
          id: "official-entry",
          title: "我从加拿大政府官方页面进入申请系统",
          kind: "required",
          description:
            "官方要求。务必从 canada.ca 官方入口进入，避免第三方仿冒站点。",
          sourceIds: ["account"],
        },
        {
          id: "visitor-visa",
          title: "我确认选择的是 visitor visa",
          kind: "required",
          description:
            "本站建议。确认申请类别为访客签证（TRV），避免误选其他许可类别。",
        },
        {
          id: "account-created",
          title: "我已创建账户或成功登录",
          kind: "required",
          description:
            "官方要求。IRCC 在线申请需账户；可能存在不同 Portal 路径，按官方当前指引选择。",
          sourceIds: ["account"],
        },
        {
          id: "recovery-saved",
          title: "我已安全保存登录和恢复方式",
          kind: "recommended",
          description:
            "本站建议。妥善保存账户与恢复方式，避免后续无法查看状态；本站不保存你的账户信息。",
        },
        {
          id: "personal-checklist",
          title: "我已查看系统生成的个性化材料清单",
          kind: "required",
          description:
            "官方要求。Portal 会生成个性化文件清单，这是最终材料依据，应以它为准而非任何攻略清单。",
          sourceIds: ["apply"],
        },
      ],
    },
    {
      id: "application",
      slug: "application",
      title: "填写在线申请",
      summary: "按官方系统逐项如实填写；本站不复制问题、不代填答案。",
      officialLinkIds: ["apply"],
      tasks: [
        {
          id: "travel-section",
          title: "旅行计划",
          kind: "required",
          description: "官方填写项。如实填写入境与离境安排，与行程说明保持一致。",
        },
        {
          id: "personal-section",
          title: "个人、护照和美国身份信息",
          kind: "required",
          description:
            "官方填写项。姓名、护照号与美国身份信息需与证件完全一致。",
        },
        {
          id: "activity-section",
          title: "教育、工作和旅行历史",
          kind: "required",
          description: "官方填写项。背景需与材料一致，时间线避免缺口或矛盾。",
        },
        {
          id: "financial-section",
          title: "财务信息",
          kind: "required",
          description: "官方填写项。与资金证明保持一致。",
        },
        {
          id: "family-section",
          title: "家庭信息",
          kind: "required",
          description: "官方填写项。如实填写家庭成员情况。",
        },
        {
          id: "background-section",
          title: "安全、医疗和移民背景问题",
          kind: "required",
          description:
            "官方填写项。涉及拒签、犯罪或移民违规等问题必须如实回答；不确定时查看官方说明或咨询专业人士。",
        },
        {
          id: "contact-section",
          title: "联系方式",
          kind: "required",
          description:
            "官方填写项。确保邮箱有效并定期查看，后续通知经此送达。",
        },
      ],
    },
    {
      id: "submission",
      slug: "submission",
      title: "上传、核对、缴费并提交",
      summary: "提交前完成最后核对，并保存确认页和收据。",
      officialLinkIds: ["apply"],
      timelineEvent: {
        id: "applicationSubmittedAt",
        label: "在线提交日期",
        description: "只记录日期，用于计算你自己的流程耗时。",
      },
      tasks: [
        {
          id: "all-files-uploaded",
          title: "已上传个性化清单要求的全部文件",
          kind: "required",
          description:
            "官方要求。按 Portal 清单逐项上传；常见遗漏是漏传清单中的某一项。",
        },
        {
          id: "files-readable",
          title: "文件清晰、方向正确且可以打开",
          kind: "required",
          description:
            "本站建议。上传前自查清晰度与方向；部分系统对单个文件大小有限制，过大需压缩。",
        },
        {
          id: "details-match",
          title: "表单与护照、I-20 等文件一致",
          kind: "required",
          description:
            "本站建议。提交前核对姓名、号码与日期，避免表单与证件不一致。",
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
      id: "biometrics-letter",
      slug: "biometrics-letter",
      title: "等待生物信息采集通知",
      summary: "查看 IRCC 账户和邮箱，确认是否需要采集生物信息。",
      officialLinkIds: ["biometrics", "after-apply"],
      timelineEvent: {
        id: "biometricsLetterReceivedAt",
        label: "收到 BIL 日期",
        description: "如无需采集，可以留空。",
      },
      tasks: [
        {
          id: "check-account",
          title: "定期查看 IRCC 账户",
          kind: "required",
          description: "官方要求。提交后通过账户接收通知，包括生物信息指示信。",
        },
        {
          id: "check-email",
          title: "查看邮箱和垃圾邮件",
          kind: "recommended",
          description: "本站建议。通知可能进入垃圾邮件，建议一并查看。",
        },
        {
          id: "bil-status",
          title: "已确认是否收到 Biometrics Instruction Letter",
          kind: "required",
          description:
            "官方要求。确认是否收到 BIL；14–79 岁申请人通常需要采集生物信息。",
          sourceIds: ["biometrics"],
        },
        {
          id: "biometrics-validity",
          title: "已通过官方工具核对既往生物信息有效性",
          kind: "conditional",
          description:
            "视情况。既往生物信息有效期为 10 年，若仍有效可能无需再次采集，以官方工具与你的通知为准。",
          sourceIds: ["biometrics"],
        },
      ],
    },
    {
      id: "biometrics",
      slug: "biometrics",
      title: "完成生物信息采集",
      summary: "收到 BIL 后按信件期限尽快预约；最终要求以你的 BIL 为准。",
      officialLinkIds: ["biometrics"],
      timelineEvent: {
        id: "biometricsCompletedAt",
        label: "完成生物信息采集日期",
        description: "如官方确认无需采集，可以留空。",
      },
      tasks: [
        {
          id: "bil-deadline",
          title: "已阅读 BIL 中的地点和截止日期",
          kind: "required",
          description:
            "官方要求。一般需在 BIL 标注日期起 30 天内完成采集；无法按时可通过官方网表申请延期。",
          sourceIds: ["biometrics"],
        },
        {
          id: "appointment-booked",
          title: "已通过官方入口预约采集点",
          kind: "required",
          description:
            "官方要求。在美国可用采集点预约；常见经验是放号窗口有限，收到 BIL 后尽快预约。",
          sourceIds: ["biometrics"],
        },
        {
          id: "appointment-saved",
          title: "已保存预约确认",
          kind: "recommended",
          description: "本站建议。保存预约确认以备现场查验。",
        },
        {
          id: "biometrics-docs",
          title: "已准备护照、BIL 和预约要求文件",
          kind: "required",
          description:
            "官方要求。现场通常需出示护照与 BIL；按通知准备所需文件。",
        },
        {
          id: "biometrics-done",
          title: "已完成指纹和照片采集",
          kind: "required",
          description: "官方要求。完成采集后留意账户状态更新。",
        },
      ],
    },
    {
      id: "processing",
      slug: "processing",
      title: "等待审理并处理额外要求",
      summary: "继续查看账户；如收到补件、面试或体检要求，以官方通知为准。",
      officialLinkIds: ["after-apply", "processing-times"],
      tasks: [
        {
          id: "monitor-status",
          title: "定期查看 IRCC 账户和邮箱",
          kind: "required",
          description:
            "官方要求。审理期间通过账户与邮箱接收任何补充要求。",
        },
        {
          id: "additional-request",
          title: "如收到额外要求，已按通知处理",
          kind: "conditional",
          description:
            "视情况。可能收到补件、面试或体检要求，按官方通知与截止日期处理。",
        },
        {
          id: "timing-expectation",
          title: "没有把预计处理时间理解为批准保证",
          kind: "required",
          description:
            "官方信息。处理时间为参考；生物信息采集所需时间不计入处理时长。",
          sourceIds: ["processing-times"],
        },
      ],
    },
    {
      id: "passport-request",
      slug: "passport-request",
      title: "收到护照递交通知",
      summary: "收到 IRCC 正式通知后再准备递交护照。",
      officialLinkIds: ["after-apply"],
      timelineEvent: {
        id: "passportRequestReceivedAt",
        label: "收到护照递交通知日期",
        description: "以 IRCC 账户内正式通知日期为准。",
      },
      tasks: [
        {
          id: "official-ppr",
          title: "已在 IRCC 账户收到正式护照递交通知",
          kind: "required",
          description:
            "官方要求。仅在收到正式护照递交通知（PPR）后再寄护照，提前寄出有风险。",
          sourceIds: ["after-apply"],
        },
        {
          id: "ppr-deadline",
          title: "已确认通知中的截止日期",
          kind: "required",
          description:
            "官方要求。注意通知中的递交期限；常见经验是自通知日起约 30 天内寄出。",
        },
        {
          id: "same-passport",
          title: "已确认递交申请时使用的同一本护照",
          kind: "required",
          description: "官方要求。需递交申请时所用的同一本护照。",
        },
        {
          id: "vfs-requirements",
          title: "已阅读 VFS 美国站最新递交要求",
          kind: "required",
          description:
            "官方要求。护照递交经美国签证申请中心办理，方式与要求以 VFS 当前页面为准。",
          sourceIds: ["vfs-us"],
        },
      ],
    },
    {
      id: "passport-submission",
      slug: "passport-submission",
      title: "向签证申请中心递交护照",
      summary: "地址、费用和寄送方式变化较快，只按 VFS 官方当前说明操作。",
      officialLinkIds: ["vfs-us"],
      timelineEvent: {
        id: "passportSubmittedAt",
        label: "寄出或递交护照日期",
        description: "用于估算贴签与返还阶段耗时。",
      },
      tasks: [
        {
          id: "original-passport",
          title: "护照原件",
          kind: "required",
          description: "官方要求。需递交护照原件；递交前确认与申请一致。",
        },
        {
          id: "ppr-letter",
          title: "IRCC 护照递交通知",
          kind: "required",
          description: "官方要求。随附 IRCC 的护照递交通知。",
        },
        {
          id: "vfs-consent",
          title: "VFS 当前要求的同意书",
          kind: "required",
          description:
            "官方要求。按 VFS 当前要求填写并签署同意书；表格以官方页面为准。",
          sourceIds: ["vfs-us"],
        },
        {
          id: "vfs-fees",
          title: "当前适用的服务费及付款方式",
          kind: "conditional",
          description:
            "视情况。VFS 服务费与付款方式（常见经验是只接受本票或汇票）以官方页面为准，不要按旧攻略准备。",
          sourceIds: ["vfs-us"],
        },
        {
          id: "delivery-method",
          title: "已确认寄送或现场递交方式",
          kind: "required",
          description:
            "官方要求。确认是邮寄还是现场递交，按 VFS 当前说明操作。",
          sourceIds: ["vfs-us"],
        },
        {
          id: "return-shipping",
          title: "已安排护照返还",
          kind: "required",
          description:
            "官方要求。安排回邮方式；多人申请时常见经验是每人需各自的回邮标签。",
        },
        {
          id: "tracking-saved",
          title: "已保存追踪号、收据和材料副本",
          kind: "recommended",
          description: "本站建议。保存快递单号与收据，便于跟踪。",
        },
      ],
    },
    {
      id: "passport-return",
      slug: "passport-return",
      title: "跟踪护照处理与返还",
      summary: "使用 VFS、IRCC 和承运商提供的方式跟踪，不向本站填写申请号。",
      officialLinkIds: ["vfs-us", "after-apply"],
      timelineEvent: {
        id: "passportReturnShippedAt",
        label: "护照开始返还日期",
        description: "如能从追踪信息确认，可记录该日期。",
      },
      tasks: [
        {
          id: "vac-received",
          title: "已确认签证申请中心收到护照",
          kind: "required",
          description: "进度确认。通过快递追踪确认 VAC 已签收护照。",
        },
        {
          id: "tracking-monitored",
          title: "已查看 VFS 或快递追踪信息",
          kind: "recommended",
          description:
            "本站建议。用 VFS 或承运商工具跟踪，无需向本站填写任何申请号。",
        },
        {
          id: "return-started",
          title: "已确认护照开始返还",
          kind: "required",
          description: "进度确认。确认护照进入寄回阶段。",
        },
      ],
    },
    {
      id: "complete",
      slug: "complete",
      title: "收到护照并核对签证",
      summary: "核对签证信息，完成本站申请流程。",
      officialLinkIds: ["visitor-overview"],
      timelineEvent: {
        id: "passportReceivedAt",
        label: "收到护照日期",
        description: "该日期用于计算从提交申请到收到护照的总耗时。",
      },
      tasks: [
        {
          id: "passport-received",
          title: "已收到护照且没有运输损坏",
          kind: "required",
          description: "进度确认。收到后先检查外包装与护照是否受损。",
        },
        {
          id: "name-checked",
          title: "签证姓名与护照一致",
          kind: "required",
          description: "本站建议。核对签证上的姓名与护照完全一致。",
        },
        {
          id: "passport-number-checked",
          title: "护照号码正确",
          kind: "required",
          description: "本站建议。核对护照号码无误。",
        },
        {
          id: "visa-details-checked",
          title: "签证类别、入境次数和有效期已核对",
          kind: "required",
          description:
            "本站建议。确认签证类别、入境次数与有效期符合预期，有疑问及时联系官方。",
        },
        {
          id: "records-saved",
          title: "已保存申请收据和决定记录",
          kind: "recommended",
          description: "本站建议。留存收据与决定记录备查。",
        },
        {
          id: "entry-understood",
          title: "我理解签证不保证入境",
          kind: "required",
          description:
            "官方信息。持签不等于必然入境，最终由加拿大边境官员在入境口岸决定。",
        },
      ],
    },
    {
      id: "timeline",
      slug: "timeline",
      title: "整理匿名时间线",
      summary: "检查本地记录；0.1 暂不上传数据，未来可选择匿名贡献聚合统计。",
      officialLinkIds: ["processing-times"],
      tasks: [
        {
          id: "timeline-reviewed",
          title: "我已检查各阶段日期是否准确",
          kind: "recommended",
          description:
            "本站建议。检查本地记录的各阶段日期是否准确，便于估算自己的耗时。",
        },
        {
          id: "privacy-understood",
          title: "我知道本站不会要求姓名、UCI 或申请号",
          kind: "informational",
          description:
            "本站说明。本站不收集姓名、UCI、申请号等敏感信息。",
        },
        {
          id: "official-vs-community",
          title: "我理解用户样本统计不等于官方处理时间",
          kind: "required",
          description:
            "官方信息。未来的用户样本统计仅供参考，与 IRCC 官方处理时间分开展示。",
          sourceIds: ["processing-times"],
        },
      ],
    },
  ],
};
