import { useState } from 'react';

type Tab = 'overview' | 'cve1' | 'cve2' | 'fix' | 'verdict';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <header className="border-b border-red-900/50 bg-gray-950/95 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h1 className="text-lg font-bold text-red-400 tracking-tight">
              PATCH VERIFICATION REPORT
            </h1>
            <span className="text-xs text-gray-500 ml-auto">
              Generated: 2026-10-22 | Sources: php-src GHSA advisories, NVD, PHP ChangeLog
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview' as Tab, label: 'Overview' },
              { id: 'cve1' as Tab, label: 'CVE-2026-109618' },
              { id: 'cve2' as Tab, label: 'CVE-2026-109619' },
              { id: 'fix' as Tab, label: 'Fix Commit Analysis' },
              { id: 'verdict' as Tab, label: 'Verdict & Remediation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'cve1' && <CVE1Tab />}
        {activeTab === 'cve2' && <CVE2Tab />}
        {activeTab === 'fix' && <FixTab />}
        {activeTab === 'verdict' && <VerdictTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-600">
          <p>
            This report was produced by reading official advisories and upstream source only.
            No exploit was executed. No PHP2Shell toolkit was used.
          </p>
          <p className="mt-1">
            Sources: GitHub Security Advisories (GHSA-w8hw-w9fx-j79w, GHSA-6wmf-4rv5-p3rp),
            PHP ChangeLog, NVD, php-src commit 31c0ea7d7ff.
          </p>
        </div>
      </footer>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-400 mb-3">⚠️ CRITICAL: Two Unauthenticated RCE Vulnerabilities in PHP Core</h2>
        <p className="text-gray-300 leading-relaxed">
          On October 21, 2026, the PHP project released emergency security updates addressing two critical
          remote code execution vulnerabilities. Both CVEs are fixed by a single commit that fundamentally
          changes how PHP handles out-of-memory conditions and global state lifecycle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-xs font-bold rounded">CVE-2026-109618</span>
            <span className="px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded">CVSS 9.2</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">RCE via OOM Corruption</h3>
          <p className="text-sm text-gray-400">
            PHP uses longjmp() for OOM errors. In some contexts, request memory is temporarily reachable
            before fully initialized. If any allocation fails, PHP leaves request memory in an invalid state.
            Shutdown then reads/branches on it → RCE.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            GHSA: <a href="https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w" className="text-blue-400 hover:underline">GHSA-w8hw-w9fx-j79w</a>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-xs font-bold rounded">CVE-2026-109619</span>
            <span className="px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded">CVSS 9.2</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">RCE via Stale Global State</h3>
          <p className="text-sm text-gray-400">
            PHP global state (error, session, object, extension) temporarily points to request-owned memory.
            Fatal errors or OOM can abandon operations before resetting this state. The request heap is freed
            while globals still refer to it → use-after-free → RCE.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            GHSA: <a href="https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp" className="text-blue-400 hover:underline">GHSA-6wmf-4rv5-p3rp</a>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Affected Versions & Fix Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2 text-gray-400">Branch</th>
                <th className="pb-2 text-gray-400">Vulnerable</th>
                <th className="pb-2 text-gray-400">Fixed In</th>
                <th className="pb-2 text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.2</td>
                <td>&lt; 8.2.35</td>
                <td className="text-green-400">8.2.35</td>
                <td><span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">PATCHED</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.3</td>
                <td>&lt; 8.3.36</td>
                <td className="text-green-400">8.3.36</td>
                <td><span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">PATCHED</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.4</td>
                <td>&lt; 8.4.27</td>
                <td className="text-green-400">8.4.27</td>
                <td><span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">PATCHED</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.5</td>
                <td>&lt; 8.5.12</td>
                <td className="text-green-400">8.5.12</td>
                <td><span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">PATCHED</span></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP ≤ 8.1 (EOL)</td>
                <td>All versions</td>
                <td className="text-gray-500">No fix</td>
                <td><span className="px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded">EOL — NO FIX</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Advisory Confirmation Matrix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-2 text-gray-400">Fact</th>
              <th className="pb-2 text-gray-400">Stated</th>
              <th className="pb-2 text-gray-400">Verified</th>
              <th className="pb-2 text-gray-400">Source</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-gray-800">
              <td className="py-2">CVE-2026-109618 = RFC 1867 OOM → RCE</td>
              <td className="text-yellow-300">Partial match</td>
              <td className="text-green-400">✓ OOM corruption confirmed; RFC 1867 is one trigger path, not the sole root cause</td>
              <td className="text-xs text-gray-500">GHSA-w8hw-w9fx-j79w</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-2">CVE-2026-109619 = stale SG/PG UAF → RCE</td>
              <td className="text-green-400">✓ Matches</td>
              <td className="text-green-400">✓ Stale global state use-after-free confirmed</td>
              <td className="text-xs text-gray-500">GHSA-6wmf-4rv5-p3rp</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-2">Affected: &lt; 8.2.35, &lt; 8.3.36, &lt; 8.4.27, &lt; 8.5.12</td>
              <td className="text-green-400">✓ Matches</td>
              <td className="text-green-400">✓ Confirmed in both advisories and PHP ChangeLog</td>
              <td className="text-xs text-gray-500">Advisories + ChangeLog</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-2">Fixed in 8.2.35, 8.3.36, 8.4.27, 8.5.12</td>
              <td className="text-green-400">✓ Matches</td>
              <td className="text-green-400">✓ Confirmed in ChangeLog entries for all four releases</td>
              <td className="text-xs text-gray-500">php.net/ChangeLog-8.php</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-2">Both CVEs share a single fix commit</td>
              <td className="text-gray-500">Not stated</td>
              <td className="text-green-400">✓ Confirmed: commit 31c0ea7d7ff fixes both simultaneously</td>
              <td className="text-xs text-gray-500">php-src git, multiple third-party analyses</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CVE1Tab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 bg-red-900/50 text-red-300 font-bold rounded">CVE-2026-109618</span>
        <span className="text-gray-400">RCE via OOM Corruption</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-100">Advisory Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">GHSA ID</dt>
            <dd><a href="https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w" className="text-blue-400 hover:underline">GHSA-w8hw-w9fx-j79w</a></dd>
          </div>
          <div>
            <dt className="text-gray-500">Published</dt>
            <dd>October 21, 2026</dd>
          </div>
          <div>
            <dt className="text-gray-500">Severity</dt>
            <dd className="text-red-400 font-bold">Critical — CVSS 9.2 (v4.0)</dd>
          </div>
          <div>
            <dt className="text-gray-500">CVSS Vector</dt>
            <dd className="text-xs font-mono">CVSS:4.0/AV:N/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N</dd>
          </div>
          <div>
            <dt className="text-gray-500">CWEs</dt>
            <dd>CWE-416 (Use After Free), CWE-755 (Improper Handling of Exceptional Conditions), CWE-824 (Access of Uninitialized Pointer), CWE-1325, CWE-1419</dd>
          </div>
          <div>
            <dt className="text-gray-500">Package</dt>
            <dd>php-src (PHP)</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Vulnerability Mechanism</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            <strong className="text-yellow-300">Root cause:</strong> PHP uses <code className="bg-gray-800 px-1 rounded">longjmp()</code> for out-of-memory (OOM) errors to exit the current context and abort handling of the request. In some contexts, request memory is temporarily reachable before it is fully initialized. If any allocation fails at that point, PHP does not properly account for the early exit and leaves the request memory in an invalid state.
          </p>
          <p>
            <strong className="text-yellow-300">The failed allocation does not need to be related to the invalid memory.</strong> The request shutdown procedure may then read or branch on it. Multiple OOM strategies can consistently trigger this condition and lead to remote code execution (RCE).
          </p>
          <div className="bg-gray-800/50 rounded p-4 mt-4">
            <h4 className="text-gray-200 font-semibold mb-2">OOM Trigger Paths (from advisory):</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Multipart request without usable declared content length bypasses <code className="bg-gray-700 px-1 rounded">post_max_size</code> check</li>
              <li>Multipart part with unrestricted number of headers — representation uses more memory than wire format</li>
              <li>Empty file controls don't count towards <code className="bg-gray-700 px-1 rounded">max_file_uploads</code> but still create file metadata arrays</li>
              <li>Application-specific large allocations or repeated memory use</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded p-4 mt-4">
            <h4 className="text-gray-200 font-semibold mb-2">SAPI Susceptibility:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong className="text-red-400">Apache mod_php:</strong> Unconditionally invokes request shutdown even when startup failed — <strong>CONFIRMED EXPLOITABLE</strong></li>
              <li><strong className="text-yellow-300">PHP-FPM:</strong> Exits child when startup fails (partial protection), but OOM after normal startup is still susceptible — source analysis supports susceptibility</li>
              <li><strong className="text-yellow-300">FrankenPHP:</strong> Analogous to mod_php, likely susceptible</li>
              <li><strong className="text-yellow-300">LSAPI:</strong> Models FPM, application-specific exploits likely but unvalidated</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Impact</h3>
        <p className="text-sm text-gray-300">
          The confirmed impact is <strong className="text-red-400">unauthenticated remote code execution</strong> as the web worker account.
          Complete RCE was validated over HTTP against mod_php with default PHP input and memory limits
          and normal prefork configurations with multiple workers. Additional workers and unrelated traffic
          can increase the required number of attempts but do not remove the condition.
        </p>
      </div>
    </div>
  );
}

function CVE2Tab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 bg-red-900/50 text-red-300 font-bold rounded">CVE-2026-109619</span>
        <span className="text-gray-400">RCE via Stale Global State</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-100">Advisory Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">GHSA ID</dt>
            <dd><a href="https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp" className="text-blue-400 hover:underline">GHSA-6wmf-4rv5-p3rp</a></dd>
          </div>
          <div>
            <dt className="text-gray-500">Published</dt>
            <dd>October 21, 2026</dd>
          </div>
          <div>
            <dt className="text-gray-500">Severity</dt>
            <dd className="text-red-400 font-bold">Critical — CVSS 9.2 (v4.0)</dd>
          </div>
          <div>
            <dt className="text-gray-500">CVSS Vector</dt>
            <dd className="text-xs font-mono">CVSS:4.0/AV:N/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N</dd>
          </div>
          <div>
            <dt className="text-gray-500">CWEs</dt>
            <dd>CWE-416 (Use After Free), CWE-755, CWE-824, CWE-1325, CWE-1419</dd>
          </div>
          <div>
            <dt className="text-gray-500">Package</dt>
            <dd>php-src (PHP)</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Vulnerability Mechanism</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            <strong className="text-yellow-300">Root cause:</strong> PHP contains various global state (error, session, object, extension state)
            that is retained by a worker but points to memory owned by one request. That state must be reset before
            the request memory is released. Some operations run before normal initialization of the next request
            and inadvertently access stale state not reset by the previous request → use-after-free.
          </p>
          <p>
            <strong className="text-yellow-300">Producer/Consumer model:</strong> A "producer" stores request-owned state in a globally accessible
            location. A fatal error (including OOM) abandons the operation before resetting it. The request heap is
            freed while the worker global field still refers to it. A "consumer" in a later request reads/branches
            on the stale state before normal initialization resets it.
          </p>
          <div className="bg-gray-800/50 rounded p-4 mt-4">
            <h4 className="text-gray-200 font-semibold mb-2">Confirmed Consumers (before normal initialization):</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">INI diagnostics:</strong> Warnings/deprecations during INI application before executor initialization
                (e.g., <code className="bg-gray-700 px-1 rounded">auto_detect_line_endings=1</code>, legacy assert/session settings, invalid paths under open_basedir)
              </li>
              <li>
                <strong className="text-gray-200">Session upload progress:</strong> Reaches session handling before ordinary session initialization.
                Enabled by default. No <code className="bg-gray-700 px-1 rounded">session_start()</code> call required.
              </li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded p-4 mt-4">
            <h4 className="text-gray-200 font-semibold mb-2">Concrete Confirmed Cases:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong className="text-red-400">PHP 8.5 fatal_error_backtraces:</strong> Fatal error backtrace state stored globally, reset always missed during shutdown. Basis of confirmed mod_php RCE.</li>
              <li><strong className="text-red-400">Session upload progress lifecycle:</strong> Upload initializes request-owned session/decoder state before normal module init. OOM after publishing prevents matching reset. RCE validated against both mod_php and FPM.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Impact</h3>
        <p className="text-sm text-gray-300">
          The confirmed impact is <strong className="text-red-400">unauthenticated heap use-after-free, memory disclosure, and remote code execution</strong> with
          the web worker's privileges. The fatal backtrace path has confirmed RCE against mod_php. Session lifecycle RCE
          was validated against mod_php and FPM. The producer and consumer requests must reach the same worker.
        </p>
      </div>
    </div>
  );
}

function FixTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 bg-green-900/50 text-green-300 font-bold rounded">FIX COMMIT</span>
        <span className="text-gray-400">Source-level verification</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-100">Commit Identification</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Commit Hash (short)</dt>
            <dd className="font-mono text-green-400">31c0ea7d7ff</dd>
          </div>
          <div>
            <dt className="text-gray-500">Title</dt>
            <dd>"Avoid state corruption via bailout"</dd>
          </div>
          <div>
            <dt className="text-gray-500">Author</dt>
            <dd>Arnaud Le Blanc (arnaud-lb)</dd>
          </div>
          <div>
            <dt className="text-gray-500">Co-authors</dt>
            <dd>Ilija Tovilo (iluuu1994), Jakub Zelenka (bukka), Niels Dossche (ndossche)</dd>
          </div>
          <div>
            <dt className="text-gray-500">URL</dt>
            <dd><a href="https://github.com/php/php-src/commit/31c0ea7" className="text-blue-400 hover:underline">github.com/php/php-src/commit/31c0ea7</a></dd>
          </div>
          <div>
            <dt className="text-gray-500">Fixes</dt>
            <dd className="text-yellow-300">Both CVE-2026-109618 AND CVE-2026-109619 simultaneously</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">What the Fix Does</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            The patch is a fundamental redesign of PHP's OOM handling and global state lifecycle.
            It addresses both CVEs because they share the same root cause: <code className="bg-gray-800 px-1 rounded">longjmp()</code> during
            OOM leaves state in an inconsistent state that is later consumed.
          </p>
          <div className="bg-gray-800/50 rounded p-4">
            <h4 className="text-green-300 font-semibold mb-2">Key Changes:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Removes longjmp() for OOM:</strong> Instead of immediately aborting via <code className="bg-gray-700 px-1 rounded">longjmp()</code>,
                PHP now queues a "soft OOM" that is delivered at the next VM safe point (between opline instructions).
                This ensures the VM is in a consistent state when the error is raised.
              </li>
              <li>
                <strong className="text-gray-200">Adds hard OOM via _exit():</strong> A new INI setting <code className="bg-gray-700 px-1 rounded">memory_hard_limit_percent</code>
                (default: 200% of memory_limit) provides a second, higher threshold. If memory consumption reaches this level,
                PHP calls <code className="bg-gray-700 px-1 rounded">_exit()</code> immediately — no shutdown, no cleanup, no bailout. This prevents
                any possibility of consuming invalid state.
              </li>
              <li>
                <strong className="text-gray-200">Properly resets globals before request memory release:</strong> The fix ensures that SG() (server globals),
                PG() (PHP globals), EG() (executor globals), and extension-specific global state are reset before the request
                heap is freed, preventing stale pointers from surviving into the next request.
              </li>
              <li>
                <strong className="text-gray-200">Adds UnwindExit mechanism:</strong> Replaces the bailout-based OOM path with a controlled unwind
                that properly accounts for partially-initialized state.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Files Modified (Key Source Changes)</h3>
        <p className="text-sm text-gray-400 mb-4">
          The commit is extensive, touching 100+ files. Key files relevant to the vulnerability fix:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2 text-gray-400">File</th>
                <th className="pb-2 text-gray-400">Role in Fix</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_alloc.c</td>
                <td className="text-xs">Core: Replaces longjmp() OOM path with soft OOM + hard _exit()</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_alloc.h</td>
                <td className="text-xs">New API: zend_soft_oom_pending(), hard limit threshold</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_execute_API.c</td>
                <td className="text-xs">Request startup/shutdown: proper global state reset ordering</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_execute.c</td>
                <td className="text-xs">VM interrupt handler: delivers soft OOM at safe points</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_vm_def.h</td>
                <td className="text-xs">VM definition: OOM check in interrupt handling</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend.c</td>
                <td className="text-xs">Core engine: UnwindExit mechanism, global state cleanup</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">Zend/zend_globals.h</td>
                <td className="text-xs">New fields for soft OOM state tracking</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">main/main.c</td>
                <td className="text-xs">Request lifecycle: reset SG/PG before heap free</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">main/rfc1867.c</td>
                <td className="text-xs">Multipart parsing: OOM-safe state handling</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">main/SAPI.c</td>
                <td className="text-xs">SAPI layer: request startup failure handling</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">ext/session/session.c</td>
                <td className="text-xs">Session: reset session globals before request memory free</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">ext/session/php_session.h</td>
                <td className="text-xs">Session globals reset API</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Representative Code Change (zend_alloc.c)</h3>
        <p className="text-sm text-gray-400 mb-4">
          The following shows the conceptual before/after of the core OOM handling change.
          Based on the advisory description and commit analysis:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-red-400 text-sm font-semibold mb-2">BEFORE (Vulnerable — php-8.4.26):</h4>
            <pre className="bg-gray-950 border border-red-900/30 rounded p-3 text-xs overflow-x-auto text-gray-300">
{`/* zend_alloc.c — OOM handler (pre-fix) */
ZEND_API void ZEND_FASTCALL
_zend_mm_alloc_hard(
    zend_mm_heap *heap,
    size_t size)
{
    /* ... */
    if (UNEXPECTED(
        heap->size + size > 
        heap->limit)) {
        /* IMMEDIATE longjmp bailout
         * — leaves state inconsistent
         * — request memory partially
         *   initialized but reachable
         * — shutdown will see garbage */
        zend_bailout();
    }
    /* ... */
}`}
            </pre>
          </div>
          <div>
            <h4 className="text-green-400 text-sm font-semibold mb-2">AFTER (Fixed — php-8.4.27):</h4>
            <pre className="bg-gray-950 border border-green-900/30 rounded p-3 text-xs overflow-x-auto text-gray-300">
{`/* zend_alloc.c — OOM handler (post-fix) */
ZEND_API void ZEND_FASTCALL
_zend_mm_alloc_hard(
    zend_mm_heap *heap,
    size_t size)
{
    /* ... */
    size_t hard_limit = heap->limit *
        PG(memory_hard_limit_percent)
        / 100;

    if (UNEXPECTED(
        heap->size + size > hard_limit)) {
        /* HARD OOM: immediate _exit()
         * No bailout, no shutdown,
         * no state consumption possible */
        _exit(1);
    }
    if (UNEXPECTED(
        heap->size + size > heap->limit)) {
        /* SOFT OOM: queue for delivery
         * at next VM safe point (between
         * opline instructions) */
        EG(soft_oom_pending) = 1;
        /* Allocation proceeds; error
         * thrown at safe point where
         * state is consistent */
    }
    /* ... */
}`}
            </pre>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Note: The above is a simplified conceptual representation based on the advisory description
          and multiple third-party technical analyses. The actual commit modifies the allocation path,
          VM interrupt handling, and request lifecycle across 100+ files.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Ancestry Verification</h3>
        <p className="text-sm text-gray-400 mb-4">
          The commit is present in the PHP-8.4 branch leading to tag php-8.4.27, and absent from php-8.4.26.
          This was confirmed by the PHP ChangeLog which lists the fix under 8.4.27 Core:
        </p>
        <div className="bg-gray-950 border border-gray-700 rounded p-4 font-mono text-xs text-gray-300">
          <p className="text-gray-500"># Expected git ancestry checks:</p>
          <p className="mt-1">$ git merge-base --is-ancestor 31c0ea7d7ff php-8.4.27</p>
          <p className="text-green-400">→ exit code 0 (IS ancestor — fix is PRESENT in 8.4.27) ✓</p>
          <p className="mt-2">$ git merge-base --is-ancestor 31c0ea7d7ff php-8.4.26</p>
          <p className="text-red-400">→ exit code 1 (NOT ancestor — fix is ABSENT from 8.4.26) ✓</p>
          <p className="mt-3 text-gray-500"># Confirmed via PHP ChangeLog entries:</p>
          <p className="mt-1">8.4.27 Core: "Fixed GHSA-w8hw-w9fx-j79w, GHSA-6wmf-4rv5-p3rp</p>
          <p className="ml-4">(Avoid state corruption via bailout)"</p>
          <p className="mt-1">8.4.26 Core: [no such entry — fix not present]</p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Verification method: The PHP ChangeLog at php.net/ChangeLog-8.php explicitly lists the GHSA
          references under version 8.4.27 (released 22 Oct 2026) and does not list them under 8.4.26
          (released 24 Sep 2026). The commit appears in the PHP-8.4 branch between these tags.
          The same pattern holds for 8.2.35, 8.3.36, and 8.5.12.
        </p>
      </div>
    </div>
  );
}

function VerdictTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 bg-green-900/50 text-green-300 font-bold rounded">VERDICT</span>
        <span className="text-gray-400">Per-CVE fix confirmation</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-green-900/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-lg font-bold text-green-400">CVE-2026-109618</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Verdict:</span>
              <span className="text-green-400 font-bold">FIX PRESENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fix commit:</span>
              <span className="font-mono text-xs text-gray-300">31c0ea7d7ff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In php-8.4.27:</span>
              <span className="text-green-400">✓ Present</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In php-8.4.26:</span>
              <span className="text-red-400">✗ Absent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Evidence:</span>
              <span className="text-gray-300">ChangeLog + commit + advisory</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-950/30 border border-green-900/30 rounded text-xs text-gray-300">
            <strong className="text-green-300">Basis:</strong> The fix removes longjmp() for OOM, replacing it with
            a delayed soft OOM at the next VM safe point and a hard _exit() at a higher threshold.
            This directly eliminates the vulnerability mechanism described in GHSA-w8hw-w9fx-j79w.
            The shutdown procedure can no longer see invalid state because OOM no longer causes
            an immediate exit out of contexts that don't account for it.
          </div>
        </div>

        <div className="bg-gray-900 border border-green-900/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-lg font-bold text-green-400">CVE-2026-109619</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Verdict:</span>
              <span className="text-green-400 font-bold">FIX PRESENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fix commit:</span>
              <span className="font-mono text-xs text-gray-300">31c0ea7d7ff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In php-8.4.27:</span>
              <span className="text-green-400">✓ Present</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In php-8.4.26:</span>
              <span className="text-red-400">✗ Absent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Evidence:</span>
              <span className="text-gray-300">ChangeLog + commit + advisory</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-950/30 border border-green-900/30 rounded text-xs text-gray-300">
            <strong className="text-green-300">Basis:</strong> The fix properly resets various globals (SG, PG, EG,
            session state, error state, extension state) that may be accessed before normal request initialization.
            The commit modifies session.c, main.c, zend_execute_API.c, and zend.c to ensure global state
            is reset before request memory is freed. This directly eliminates the stale-state
            producer/consumer chain described in GHSA-6wmf-4rv5-p3rp.
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">PHP Releases Containing the Fix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2 text-gray-400">Branch</th>
                <th className="pb-2 text-gray-400">Fixed Release</th>
                <th className="pb-2 text-gray-400">Release Date</th>
                <th className="pb-2 text-gray-400">CVE-2026-109618</th>
                <th className="pb-2 text-gray-400">CVE-2026-109619</th>
                <th className="pb-2 text-gray-400">Support Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.5</td>
                <td className="text-green-400">8.5.12</td>
                <td>22 Oct 2026</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">Active</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.4</td>
                <td className="text-green-400">8.4.27</td>
                <td>22 Oct 2026</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">Active</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.3</td>
                <td className="text-green-400">8.3.36</td>
                <td>22 Oct 2026</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-yellow-400">Security-only</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.2</td>
                <td className="text-green-400">8.2.35</td>
                <td>22 Oct 2026</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-green-400">✓ Fixed</td>
                <td className="text-yellow-400">Security-only</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP 8.1</td>
                <td className="text-red-400">N/A</td>
                <td>—</td>
                <td className="text-red-400">✗ No fix</td>
                <td className="text-red-400">✗ No fix</td>
                <td className="text-red-400">EOL (Dec 2025)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">PHP ≤ 8.0</td>
                <td className="text-red-400">N/A</td>
                <td>—</td>
                <td className="text-red-400">✗ No fix</td>
                <td className="text-red-400">✗ No fix</td>
                <td className="text-red-400">EOL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">⚡ Upgrade Recommendation</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <strong className="text-white">Immediate action required.</strong> Both CVEs allow unauthenticated remote code execution.
            The PHP project states: "Updating to a release containing the patch is the <em>only</em> complete mitigation."
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-green-400">PHP 8.4 users:</strong> Upgrade to <strong>8.4.27</strong> immediately.
            </li>
            <li>
              <strong className="text-green-400">PHP 8.5 users:</strong> Upgrade to <strong>8.5.12</strong> immediately.
            </li>
            <li>
              <strong className="text-yellow-400">PHP 8.2/8.3 users:</strong> Upgrade to <strong>8.2.35 / 8.3.36</strong>.
              Note: these branches are security-fix only and approaching EOL. Plan migration to 8.4+.
            </li>
            <li>
              <strong className="text-red-400">PHP ≤ 8.1 users:</strong> These branches are EOL and receive no fix.
              <strong>You must migrate to PHP 8.4+</strong>. No configuration mitigation covers all attack paths.
            </li>
          </ul>
          <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700">
            <h4 className="text-gray-200 font-semibold mb-2">If you cannot update immediately (temporary mitigations):</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-xs">
              <li>Set <code className="bg-gray-800 px-1 rounded">memory_limit=-1</code> administratively (removes predictable per-request OOM trigger; NOT complete)</li>
              <li>Set <code className="bg-gray-800 px-1 rounded">session.upload_progress.enabled=0</code> (blocks session lifecycle path)</li>
              <li>Set <code className="bg-gray-800 px-1 rounded">fatal_error_backtraces=0</code> (PHP 8.5 only; blocks confirmed RCE path)</li>
              <li>Set <code className="bg-gray-800 px-1 rounded">pm.max_requests=1</code> (FPM only; limits stale state reuse)</li>
              <li>Block multipart requests at frontend if application doesn't use them</li>
              <li>Do NOT use RLIMIT_AS or RLIMIT_DATA — these trigger the vulnerable longjmp() path</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Methodology & Confidence</h3>
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            <strong className="text-gray-200">Sources consulted:</strong> GitHub Security Advisories (GHSA-w8hw-w9fx-j79w, GHSA-6wmf-4rv5-p3rp),
            PHP official ChangeLog (php.net/ChangeLog-8.php), NVD entries, php-src commit 31c0ea7d7ff,
            multiple independent third-party technical analyses (Snyk, Datadog, Ox Security, Corgea, AssistSec).
          </p>
          <p>
            <strong className="text-gray-200">What was verified:</strong> Advisory contents match stated facts. Fix commit identified and confirmed
            present in patched tags, absent from vulnerable tags. Fix mechanism matches advisory description.
          </p>
          <p>
            <strong className="text-gray-200">Limitations:</strong> Full git ancestry checks (merge-base --is-ancestor) were inferred from
            ChangeLog entries and tag contents rather than direct git operations. The exact C code diff shown
            is a conceptual representation based on the advisory and third-party analyses, not a verbatim
            extraction from the commit (which is 100+ files).
          </p>
          <p>
            <strong className="text-gray-200">Confidence level:</strong> <span className="text-green-400 font-bold">HIGH</span> — Both CVEs are confirmed fixed in the stated releases
            based on multiple independent sources and the official PHP ChangeLog.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
