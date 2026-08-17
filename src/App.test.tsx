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
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(8);
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
});
