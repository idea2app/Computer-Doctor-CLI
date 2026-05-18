import { Box, Text } from 'ink';

import type { MVPFlowResult } from '../workflow/mvp-runner.js';

export function RunSummary({ result, verbose }: { result: MVPFlowResult; verbose: boolean }) {
  return (
    <Box flexDirection="column">
      <Text color="green">✔ Computer Doctor MVP flow completed</Text>
      <Text>Session: {result.sessionId}</Text>
      <Text>Platform adapter: {result.platform}</Text>
      <Text>Actions executed: {result.actionCount}</Text>
      {Object.entries(result.reports).map(([stage, reportPath]) => (
        <Text key={stage}>
          - {stage}: {reportPath}
        </Text>
      ))}
      {verbose ? <Text color="yellow">Verbose mode enabled</Text> : null}
    </Box>
  );
}
