/**
 * @summary The global JavaScript file for the site.
 *
 * With WebC, you can add scoped <script> tags directly to your components.
 * This file is for JavaScript that needs to be available on all pages.
 */


function formatCron(now) {
  return [
    { label: 'Minute', value: now.getMinutes() },
    { label: 'Hour', value: now.getHours() },
    { label: 'Day of month', value: now.getDate() },
    { label: 'Month', value: now.getMonth() + 1 },
    { label: 'Day of week', value: now.getDay() },
  ];
}

function startClock() {
  const clock = document.getElementById('crontab-clock');
  const title = document.getElementById('terminal-title');
  const promptCommand = document.getElementById('prompt-command');
  const promptCursor = document.querySelector('.prompt__cursor');
  if (!clock) {
    return;
  }

  if (title) {
    const zone =
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'local';
    title.textContent = `CRONTAB CLOCK - ${zone}`;
  }

  const parts = [
    { label: 'Minute', key: 'minute' },
    { label: 'Hour', key: 'hour' },
    { label: 'Day of month', key: 'dom' },
    { label: 'Month', key: 'month' },
    { label: 'Day of week', key: 'dow' },
  ];

  const fields = parts.map((part) => {
    const span = document.createElement('span');
    span.className = 'clock__field';
    span.dataset.label = part.label;
    span.setAttribute('aria-label', part.label);
    span.setAttribute('title', part.label);
    span.setAttribute('tabindex', '0');
    return span;
  });

  const sep = () => {
    const s = document.createElement('span');
    s.className = 'clock__sep';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ' ';
    return s;
  };

  clock.replaceChildren(
    fields[0],
    sep(),
    fields[1],
    sep(),
    fields[2],
    sep(),
    fields[3],
    sep(),
    fields[4]
  );

  const update = () => {
    const values = formatCron(new Date());
    const plain = values.map((part) => part.value).join(' ');
    clock.setAttribute('aria-label', `Crontab time ${plain}`);
    values.forEach((part, index) => {
      fields[index].textContent = String(part.value).padStart(2, '0');
    });
  };

  const startUpdates = () => {
    clock.classList.remove('clock--hidden');
    update();
    window.setInterval(update, 1000);
  };

  if (promptCommand) {
    const fullCommand = promptCommand.dataset.command ?? '';
    let index = 0;
    const typeNext = () => {
      promptCommand.textContent = fullCommand.slice(0, index);
      index += 1;
      if (index <= fullCommand.length) {
        window.setTimeout(typeNext, 60);
      } else {
        if (promptCursor) {
          promptCursor.classList.add('is-hidden');
        }
        startUpdates();
      }
    };
    typeNext();
  } else {
    startUpdates();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startClock, { once: true });
} else {
  startClock();
}
