
    // JavaScript code

    // 计算每个规则对应的折扣优惠开始生效的天数
    function calculateDiscountDays(ridesPerDay, costPerRide, rules) {
      let totalCost = 0;
      let day = 0;
      let ruleIndex = 0;
      let daysForRules = [];

      // 对规则按消费门槛进行排序
      rules.sort((a, b) => a.threshold - b.threshold);

      while (ruleIndex < rules.length) {
        day++; // 每次循环代表新的一天
        totalCost += ridesPerDay * costPerRide; // 更新累计消费金额

        // 检查当前累计消费是否达到当前规则的门槛
        if (totalCost >= rules[ruleIndex].threshold) {
          daysForRules.push(day); // 记录达到规则门槛的天数
          ruleIndex++; // 移动到下一个规则
        }
      }

      return daysForRules;
    }