import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

describe('Cuecraft workspace', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the run of show and readiness context', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Nocturne / Opening Night' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Run of show' })).toBeInTheDocument();
    expect(screen.getByText('3 of 8 cues cleared')).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Run of show' })).getAllByRole('button', { pressed: false }),
    ).toHaveLength(8);
  });

  it('filters cues and restores the full list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search run of show' }), 'quartet');
    expect(screen.getByRole('button', { name: /opening chord/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /VX 04 Title card/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('button', { name: /VX 04 Title card/i })).toBeInTheDocument();
  });

  it('opens cue details and updates readiness', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /SD 06 Opening chord/i }));
    const inspector = screen.getByRole('complementary', { name: /opening chord/i });
    expect(within(inspector).getByText('Theo Brooks')).toBeInTheDocument();

    await user.click(within(inspector).getByRole('radio', { name: 'Ready' }));
    expect(screen.getByText('4 of 8 cues cleared')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('cuecraft:cue-states:v1') ?? '{}')).toMatchObject({
      'opening-chord': 'ready',
    });
  });

  it('shows an actionable empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search run of show' }), 'not a real cue');
    expect(screen.getByRole('heading', { name: 'No cues match' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Showing 0 of 8 cues');
  });

  it('isolates timing conflicts and restores the complete run', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: '1 timing collision' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Review conflicts' }));

    expect(screen.getByRole('status')).toHaveTextContent('Showing 2 of 8 cues');
    expect(screen.getByRole('button', { name: /LX 01 House to half/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LX 03 Preset reveal/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /SD 02 Foyer bed out/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show complete run' }));
    expect(screen.getByRole('status')).toHaveTextContent('Showing 8 of 8 cues');
  });

  it('announces and undoes the latest readiness update', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /SD 06 Opening chord/i }));
    const inspector = screen.getByRole('complementary', { name: /opening chord/i });
    await user.click(within(inspector).getByRole('radio', { name: 'Ready' }));

    const notice = screen.getByText('Readiness changed to Ready.').closest('.change-notice');
    expect(notice).toHaveTextContent('Opening chordReadiness changed to Ready.');
    await user.click(within(notice as HTMLElement).getByRole('button', { name: 'Undo' }));

    expect(within(inspector).getByRole('radio', { name: 'Draft' })).toBeChecked();
    expect(screen.getByText('3 of 8 cues cleared')).toBeInTheDocument();
  });
});
