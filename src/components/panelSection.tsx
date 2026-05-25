import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Prism from 'prismjs';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

gsap.registerPlugin(ScrollTrigger);

const codeSnippets = {
  POWERSHELL: `# Find and unlock all currently locked-out user accounts in the domain
Import-Module ActiveDirectory

$locked = Search-ADAccount -LockedOut |
          Where-Object { $_.Enabled -eq $true }

foreach ($u in $locked) {
    Write-Host "[+] Unlocking $($u.SamAccountName) ($($u.Name))" -ForegroundColor Green
    Unlock-ADAccount -Identity $u.SamAccountName
}

Write-Host "Done. Unlocked $($locked.Count) account(s)." -ForegroundColor Yellow`,

  BASH: `#!/usr/bin/env bash
# Nightly backup verifier — checks size + age, alerts on stale snapshots
set -euo pipefail

BACKUP_DIR="/srv/backups"
MAX_AGE_HOURS=26
MIN_SIZE_MB=500

for f in "$BACKUP_DIR"/*.tar.gz; do
  age=$(( ( $(date +%s) - $(stat -c %Y "$f") ) / 3600 ))
  size=$(( $(stat -c %s "$f") / 1024 / 1024 ))

  if (( age > MAX_AGE_HOURS )) || (( size < MIN_SIZE_MB )); then
    echo "[ALERT] $f age=\${age}h size=\${size}MB"
    mail -s "Backup stale" ops@contoso.lab < /dev/null
  else
    echo "[ OK ] $f age=\${age}h size=\${size}MB"
  fi
done`,

  SQL: `-- Helpdesk: tickets breaching SLA in the next 4 hours
SELECT  t.ticket_id,
        u.display_name              AS requester,
        t.priority,
        t.subject,
        TIMESTAMPDIFF(MINUTE, NOW(), t.sla_due) AS mins_left,
        a.display_name              AS owner
FROM    tickets t
JOIN    users u  ON u.user_id  = t.requester_id
LEFT JOIN users a ON a.user_id = t.owner_id
WHERE   t.status NOT IN ('Resolved','Closed')
  AND   t.sla_due BETWEEN NOW() AND NOW() + INTERVAL 4 HOUR
ORDER BY t.priority ASC, t.sla_due ASC;`,
};

const langMap: Record<string, string> = {
  POWERSHELL: 'powershell',
  BASH: 'bash',
  SQL: 'sql',
};

const extMap: Record<string, string> = {
  POWERSHELL: 'ps1',
  BASH: 'sh',
  SQL: 'sql',
};

const SPEED = 14;

export default function CodePanel() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<keyof typeof codeSnippets>('POWERSHELL');
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const code = codeSnippets[tab];
    setTyped('');
    setTyping(true);
    const id = setInterval(() => {
      if (i <= code.length) {
        setTyped(code.slice(0, i));
        i++;
      } else {
        clearInterval(id);
        setTyping(false);
      }
    }, SPEED);
    return () => clearInterval(id);
  }, [tab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-code-panel]', {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-code-panel]', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const html = Prism.highlight(
    typed,
    Prism.languages[langMap[tab]] || Prism.languages.plaintext,
    langMap[tab]
  );

  return (
    <section
      ref={root}
      id="code"
      className="relative py-32 md:py-44 px-5 md:px-10 bg-ink overflow-hidden border-t border-acid/15"
    >
      <div className="max-w-[1500px] mx-auto scroll-skew">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-10 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-acid mb-4 flex items-center gap-3">
              <span className="led led-green animate-led-blink" />
              ◉ 08 — automation.shell
            </div>
            <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95]">
              Repetitive work? <span className="italic text-acid">Scripted.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
            <p className="text-bone/70 leading-relaxed">
              Three real artefacts from the lab and prior roles —
              PowerShell to unlock AD accounts, Bash to verify backups,
              SQL to flag SLA breaches. Switch tabs to watch them type.
            </p>
          </div>
        </div>

        <div
          data-code-panel
          className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-acid/15 border border-acid/15 overflow-hidden"
        >
          {/* Code area */}
          <div className="lg:col-span-8 bg-ink p-6 md:p-10 min-h-[480px] md:min-h-[560px] flex flex-col scanlines relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-acid/15">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="led led-red" />
                  <span className="led led-amber" />
                  <span className="led led-green animate-led-blink" />
                </div>
                <span className="mono text-[10px] uppercase tracking-widest text-bone/50">
                  ~ / scripts / {tab.toLowerCase()}.{extMap[tab]}
                </span>
              </div>
              <div className="flex gap-2">
                {(Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    data-cursor="Run"
                    className={
                      'mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ' +
                      (tab === t
                        ? 'bg-acid text-ink border-acid'
                        : 'border-bone/20 text-bone/60 hover:border-acid hover:text-acid')
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <pre className="mono text-sm md:text-[14px] leading-relaxed flex-1 overflow-auto whitespace-pre-wrap">
              <code
                className={`language-${langMap[tab]}`}
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ color: '#cfe7d0' }}
              />
              {typing && <span className="inline-block w-2 h-4 ml-0.5 bg-acid align-middle animate-pulse" />}
            </pre>
          </div>

          {/* Side */}
          <div className="lg:col-span-4 bg-ink p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-bone/40 mb-4">
                Toolbelt
              </div>
              <ul className="space-y-3 text-bone/80">
                {[
                  'PowerShell · AD Module · Graph',
                  'Bash · cron · systemd',
                  'SQL · MySQL · Postgres',
                  'Python · requests · paramiko',
                  'Git · GitHub Actions',
                ].map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="led led-green" />
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 mt-10">
              <a
                href="https://github.com/ProudStone-576"
                target="_blank"
                data-cursor="GitHub"
                className="block w-full text-center bg-acid text-ink mono text-xs uppercase tracking-widest font-bold py-4 hover:bg-bone transition-colors"
              >
                Browse Scripts ↗
              </a>
              <a
                href="/Taran_Matharu_resume.pdf"
                target="_blank"
                data-cursor="PDF"
                className="block w-full text-center mono text-xs uppercase tracking-widest border border-acid/40 py-4 hover:border-acid hover:text-acid transition-colors"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
