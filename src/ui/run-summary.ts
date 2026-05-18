import React from 'react';
import { Box, Text } from 'ink';
import type { MVPFlowResult } from '../workflow/mvp-runner.js';

export function RunSummary({ result, verbose }: { result: MVPFlowResult; verbose: boolean }): any {
  return React.createElement(
    Box,
    { flexDirection: 'column' },
    React.createElement(Text, { color: 'green' }, '✔ Computer Doctor MVP flow completed'),
    React.createElement(Text, null, `Session: ${result.sessionId}`),
    React.createElement(Text, null, `Platform adapter: ${result.platform}`),
    React.createElement(Text, null, `Actions executed: ${result.actionCount}`),
    ...Object.entries(result.reports).map(([stage, reportPath]) =>
      React.createElement(Text, { key: stage }, `- ${stage}: ${reportPath}`)
    ),
    verbose ? React.createElement(Text, { color: 'yellow' }, 'Verbose mode enabled') : null
  );
}
