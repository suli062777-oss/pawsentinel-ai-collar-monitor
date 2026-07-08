export const PawRoomCopy = {
  boundaries: {
    trendDisclaimer:
      '生命状态仅作趋势参考，不构成医疗诊断。如宠物持续异常或明显不适，请及时联系兽医。',
    aiInterpretationDisclaimer:
      'AI 演绎内容来自项圈数据和用户补充，不等同于真实行为录像。',
    forbiddenBubbleTerms: ['诊断', '疾病判断', '医疗级监测', '医疗级'],
  },
  credits: {
    includedSafetyMonitoring:
      '安全看护、状态推送和基础桌宠互动不消耗 Paw Credits。',
    chargePolicy: '用户确认创建记忆内容后扣费，生成失败会自动退回。',
    insufficient: 'Paw Credits 余额不足。',
  },
  demo: {
    sessionStarted: 'Demo 场景已开始',
  },
  state: {
    vitalDoor:
      '门口活动和状态趋势同时有波动，建议打开详情看一下。',
    vitalGeneral: '生命状态趋势略有波动，仅作看护参考。',
    longRest: '休息时间较长，建议稍后再观察。',
    lowBattery: '项圈电量低于 15%，记得充电。',
    bedWalking: '正在回到宠物窝附近。',
    bedSleeping: '正在宠物窝休息。',
    sofaWalking: '慢慢走到沙发附近。',
    sofaResting: '正在沙发附近休息。',
    doorWaiting: '在门口停留时间较长，可以稍后看一看。',
    toyPlaying: '正在玩具区活动。',
    bowlWalking: '正在饭盆附近活动。',
    windowWalking: '去了窗边。',
    normal: '状态正常。',
  },
  timeline: {
    userSupplementTitle: '主人补充',
    attentionTitle: '需要查看',
    watchTitle: '轻微关注',
    normalTitle: '状态记录',
    defaultUserEvent: '主人补充了一条事件。',
  },
  interactions: {
    pat: '你轻轻摸了摸桌宠，它做出了开心反馈。',
    feed: '你投喂了一份虚拟小零食，基础互动不消耗 Paw Credits。',
    callName: '你叫了它的名字，它抬头回应了一下。',
    toy: '你扔出了虚拟玩具，它短暂进入玩耍动作。',
    fallback: '你和桌宠进行了一次轻互动。',
  },
  settings: {
    medicalBoundary:
      'PawRoom 展示的是日常看护趋势和状态提醒，不提供医疗诊断。',
  },
} as const;
