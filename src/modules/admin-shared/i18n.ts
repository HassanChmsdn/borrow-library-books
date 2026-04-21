import { formatTemplate } from "@/lib/i18n";

function matchPattern(text: string, pattern: RegExp) {
  const match = text.match(pattern);

  return match ? match.slice(1) : null;
}

export function translateAdminActivityText(
  text: string,
  translateText: (value: string) => string,
) {
  const requestDescription = matchPattern(
    text,
    /^(Custom-duration|Standard) request for (\d+) days at (.+)\.$/,
  );

  if (requestDescription) {
    return formatTemplate(
      translateText("{requestType} request for {count} days at {branch}."),
      {
        branch: requestDescription[2],
        count: requestDescription[1],
        requestType: translateText(requestDescription[0]),
      },
    );
  }

  return translateText(text);
}

export function translateAdminDashboardText(
  text: string,
  translateText: (value: string) => string,
) {
  const customReview = matchPattern(text, /^(\d+) custom review$/);

  if (customReview) {
    return formatTemplate(translateText("{count} custom review"), {
      count: customReview[0],
    });
  }

  const onTrack = matchPattern(text, /^(\d+) on track$/);

  if (onTrack) {
    return formatTemplate(translateText("{count} on track"), {
      count: onTrack[0],
    });
  }

  const cashReview = matchPattern(text, /^(\d+) need cash review$/);

  if (cashReview) {
    return formatTemplate(translateText("{count} need cash review"), {
      count: cashReview[0],
    });
  }

  const settledRecords = matchPattern(text, /^(\d+) settled records$/);

  if (settledRecords) {
    return formatTemplate(translateText("{count} settled records"), {
      count: settledRecords[0],
    });
  }

  const memberAccounts = matchPattern(text, /^(\d+) member accounts$/);

  if (memberAccounts) {
    return formatTemplate(translateText("{count} member accounts"), {
      count: memberAccounts[0],
    });
  }

  const openItems = matchPattern(text, /^(\d+) open items$/);

  if (openItems) {
    return formatTemplate(translateText("{count} open items"), {
      count: openItems[0],
    });
  }

  const overdueCases = matchPattern(text, /^(\d+) overdue cases$/);

  if (overdueCases) {
    return formatTemplate(translateText("{count} overdue cases"), {
      count: overdueCases[0],
    });
  }

  const manualReview = matchPattern(
    text,
    /^(\d+) custom-duration requests? need manual review\.$/,
  );

  if (manualReview) {
    return formatTemplate(
      translateText("{count} custom-duration requests need manual review."),
      {
        count: manualReview[0],
      },
    );
  }

  const onsiteCash = matchPattern(text, /^(\d+) accounts? still owe onsite cash\.$/);

  if (onsiteCash) {
    return formatTemplate(translateText("{count} accounts still owe onsite cash."), {
      count: onsiteCash[0],
    });
  }

  const averageBorrowings = matchPattern(
    text,
    /^Average of ([\d.]+) borrowings started or requested per day\.$/,
  );

  if (averageBorrowings) {
    return formatTemplate(
      translateText("Average of {count} borrowings started or requested per day."),
      {
        count: averageBorrowings[0],
      },
    );
  }

  const loanCount = matchPattern(text, /^(\d+) loans$/);

  if (loanCount) {
    return formatTemplate(translateText("{count} loans"), {
      count: loanCount[0],
    });
  }

  const maintenanceCopies = matchPattern(
    text,
    /^(\d+) copies currently held for maintenance\.$/,
  );

  if (maintenanceCopies) {
    return formatTemplate(
      translateText("{count} copies currently held for maintenance."),
      {
        count: maintenanceCopies[0],
      },
    );
  }

  return translateAdminActivityText(text, translateText);
}

export function translateAdminFinancialText(
  text: string,
  translateText: (value: string) => string,
) {
  const settledRecords = matchPattern(text, /^(\d+) settled records$/);

  if (settledRecords) {
    return formatTemplate(translateText("{count} settled records"), {
      count: settledRecords[0],
    });
  }

  const overdueDues = matchPattern(text, /^(\d+) overdue dues$/);

  if (overdueDues) {
    return formatTemplate(translateText("{count} overdue dues"), {
      count: overdueDues[0],
    });
  }

  const lastThirtyDays = matchPattern(text, /^(\$[\d.]+) last 30 days$/);

  if (lastThirtyDays) {
    return formatTemplate(translateText("{amount} last 30 days"), {
      amount: lastThirtyDays[0],
    });
  }

  return translateText(text);
}

export function translateAdminBorrowingText(
  text: string,
  translateText: (value: string) => string,
) {
  const loanDuration = matchPattern(text, /^(\d+)-day loan$/);

  if (loanDuration) {
    return formatTemplate(translateText("{count}-day loan"), {
      count: loanDuration[0],
    });
  }

  const customDuration = matchPattern(text, /^(\d+)-day custom$/);

  if (customDuration) {
    return formatTemplate(translateText("{count}-day custom"), {
      count: customDuration[0],
    });
  }

  return translateText(text);
}