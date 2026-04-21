import { formatTemplate } from "@/lib/i18n";

function matchPattern(text: string, pattern: RegExp) {
  const match = text.match(pattern);

  return match ? match.slice(1) : null;
}

export function translateAdminUserText(
  text: string,
  translateText: (value: string) => string,
) {
  const overdueCase = matchPattern(text, /^(\d+) overdue case$/);

  if (overdueCase) {
    return formatTemplate(translateText("{count} overdue case"), {
      count: overdueCase[0],
    });
  }

  const overdueCases = matchPattern(text, /^(\d+) overdue cases$/);

  if (overdueCases) {
    return formatTemplate(translateText("{count} overdue cases"), {
      count: overdueCases[0],
    });
  }

  const activePending = matchPattern(text, /^(\d+) active, (\d+) pending$/);

  if (activePending) {
    return formatTemplate(translateText("{active} active, {pending} pending"), {
      active: activePending[0],
      pending: activePending[1],
    });
  }

  const singlePendingRequest = matchPattern(text, /^(\d+) pending request$/);

  if (singlePendingRequest) {
    return formatTemplate(translateText("{count} pending request"), {
      count: singlePendingRequest[0],
    });
  }

  const multiplePendingRequests = matchPattern(text, /^(\d+) pending requests$/);

  if (multiplePendingRequests) {
    return formatTemplate(translateText("{count} pending requests"), {
      count: multiplePendingRequests[0],
    });
  }

  const singleActiveLoan = matchPattern(text, /^(\d+) active loan$/);

  if (singleActiveLoan) {
    return formatTemplate(translateText("{count} active loan"), {
      count: singleActiveLoan[0],
    });
  }

  const multipleActiveLoans = matchPattern(text, /^(\d+) active loans$/);

  if (multipleActiveLoans) {
    return formatTemplate(translateText("{count} active loans"), {
      count: multipleActiveLoans[0],
    });
  }

  const singleCompletedBorrowing = matchPattern(text, /^(\d+) completed borrowing$/);

  if (singleCompletedBorrowing) {
    return formatTemplate(translateText("{count} completed borrowing"), {
      count: singleCompletedBorrowing[0],
    });
  }

  const multipleCompletedBorrowings = matchPattern(text, /^(\d+) completed borrowings$/);

  if (multipleCompletedBorrowings) {
    return formatTemplate(translateText("{count} completed borrowings"), {
      count: multipleCompletedBorrowings[0],
    });
  }

  const singleAwaitingApproval = matchPattern(text, /^(\d+) request awaiting approval$/);

  if (singleAwaitingApproval) {
    return formatTemplate(translateText("{count} request awaiting approval"), {
      count: singleAwaitingApproval[0],
    });
  }

  const multipleAwaitingApproval = matchPattern(text, /^(\d+) requests awaiting approval$/);

  if (multipleAwaitingApproval) {
    return formatTemplate(translateText("{count} requests awaiting approval"), {
      count: multipleAwaitingApproval[0],
    });
  }

  const dueDate = matchPattern(text, /^Due (.+)$/);

  if (dueDate) {
    return formatTemplate(translateText("Due {date}"), { date: dueDate[0] });
  }

  const startedDate = matchPattern(text, /^Started (.+)$/);

  if (startedDate) {
    return formatTemplate(translateText("Started {date}"), { date: startedDate[0] });
  }

  const requestedDate = matchPattern(text, /^Requested (.+)$/);

  if (requestedDate) {
    return formatTemplate(translateText("Requested {date}"), { date: requestedDate[0] });
  }

  const returnedDate = matchPattern(text, /^Returned (.+)$/);

  if (returnedDate) {
    return formatTemplate(translateText("Returned {date}"), { date: returnedDate[0] });
  }

  const onboardingNote = matchPattern(text, /^Onboarding note: (.+)$/);

  if (onboardingNote) {
    return formatTemplate(translateText("Onboarding note: {note}"), {
      note: onboardingNote[0],
    });
  }

  const feeLabel = matchPattern(text, /^(.*) cash$/);

  if (feeLabel) {
    return formatTemplate(translateText("{amount} cash"), {
      amount: feeLabel[0],
    });
  }

  const duration = matchPattern(text, /^(\d+) days$/);

  if (duration) {
    return formatTemplate(translateText("{count} days"), {
      count: duration[0],
    });
  }

  return translateText(text);
}