/*
 * The record. This is the only file you edit to add a contribution.
 *
 * Append an object with: repo, prs, title, date, state, problem, tags.
 * Star counts are not stored here. scripts/refresh_stars.py reads the repo
 * names out of this file and writes data/stars.js on its own, so a scheduled
 * refresh never touches a line you wrote.
 *
 * state: "merged" or "open". prs is a list so one entry can cover a group of
 * pull requests that landed as a single piece of work.
 */
window.CONTRIBUTIONS = [
  {
    "repo": "open-telemetry/opentelemetry-collector-contrib",
    "prs": [{ "n": 50780, "url": "https://github.com/open-telemetry/opentelemetry-collector-contrib/pull/50780" }],
    "title": "Add a double_value precision operator to pmetricassert",
    "date": "2026-09-06",
    "state": "merged",
    "problem": "pmetricassert compared float metric values exactly, so any test over data that drifts in its last decimal places had no way to assert equality within a tolerance. Added a precision operator with tests covering both a value that drifts below the stated precision and one that drifts at it.",
    "tags": ["go", "observability"]
  },
  {
    "repo": "parseablehq/parseable",
    "prs": [{ "n": 1402, "url": "https://github.com/parseablehq/parseable/pull/1402" }],
    "title": "Return an explicit error for unrecognized static schema data types",
    "date": "2025-08-12",
    "state": "merged",
    "problem": "A static schema naming a data type Parseable did not recognize failed without reporting which type was at fault. Added a dedicated error variant that names it, plus a unit test.",
    "tags": ["rust", "observability"]
  },
  {
    "repo": "openobserve/openobserve",
    "prs": [
      { "n": 7750, "url": "https://github.com/openobserve/openobserve/pull/7750" },
      { "n": 7740, "url": "https://github.com/openobserve/openobserve/pull/7740" }
    ],
    "title": "Audit trail for alert, dashboard and search exports",
    "date": "2025-08-01",
    "state": "merged",
    "problem": "Exporting an alert or a dashboard was indistinguishable from an ordinary read in the audit trail. Added dedicated export endpoints for both and a Download variant on the search event type, so downloads become attributable events rather than invisible ones.",
    "tags": ["rust", "observability"]
  },
  {
    "repo": "commonwarexyz/monorepo",
    "prs": [{ "n": 689, "url": "https://github.com/commonwarexyz/monorepo/pull/689" }],
    "title": "Show log example timestamps in the local timezone",
    "date": "2025-04-06",
    "state": "merged",
    "problem": "The log example rendered every timestamp in UTC no matter where it ran, so the times on screen did not line up with anything else on the operator's machine. Switched the GUI to the host timezone.",
    "tags": ["rust", "distributed-systems"]
  },
  {
    "repo": "vectordotdev/vector",
    "prs": [{ "n": 22242, "url": "https://github.com/vectordotdev/vector/pull/22242" }],
    "title": "Unify HTTP query parameter handling across the http source",
    "date": "2025-02-07",
    "state": "merged",
    "problem": "The http source had accumulated several divergent ways to configure query parameters. Unified them behind one mechanism across fourteen files while keeping every existing configuration working unchanged.",
    "tags": ["rust", "observability"]
  },
  {
    "repo": "vectordotdev/vrl",
    "prs": [{ "n": 1223, "url": "https://github.com/vectordotdev/vrl/pull/1223" }],
    "title": "Fix parse_duration rejecting decimal values",
    "date": "2025-01-27",
    "state": "merged",
    "problem": "After parse_duration moved to humantime it silently stopped accepting decimals, so a duration like 1.5h that had worked for years became an error. Restored it by falling back to the previous parser when humantime refuses the input.",
    "tags": ["rust", "observability"]
  },
  {
    "repo": "robustmq/robustmq",
    "prs": [{ "n": 795, "url": "https://github.com/robustmq/robustmq/pull/795" }],
    "title": "Generate gRPC request validation from the proto files",
    "date": "2025-01-23",
    "state": "merged",
    "problem": "Every RPC needed a validate function written and maintained by hand, which is exactly the kind of code that drifts out of sync with the schema. Moved the rules into the proto definitions with prost-validate so the generated code carries them, which also meant upgrading tonic and prost and moving the workspace onto shared versions.",
    "tags": ["rust", "distributed-systems"]
  },
  {
    "repo": "vectordotdev/vector",
    "prs": [{ "n": 22072, "url": "https://github.com/vectordotdev/vector/pull/22072" }],
    "title": "New Keep sink",
    "date": "2025-01-23",
    "state": "merged",
    "problem": "Vector had no way to forward events into Keep, so alerts had to be routed through a generic HTTP sink and reassembled on the other side. Built the sink end to end: configuration, encoding, request building, integration tests and docs.",
    "tags": ["rust", "observability"]
  },
  {
    "repo": "keephq/keep",
    "prs": [{ "n": 2828, "url": "https://github.com/keephq/keep/pull/2828" }],
    "title": "Let the Vector provider wrap multiple source types",
    "date": "2024-12-19",
    "state": "merged",
    "problem": "Keep's Vector provider assumed one upstream source type, so alerts that arrived through Vector lost the identity of the system that actually raised them. Refactored it to wrap the wrapped provider's type, starting with Prometheus and Grafana.",
    "tags": ["python", "observability"]
  },
  {
    "repo": "databendlabs/openraft",
    "prs": [{ "n": 1274, "url": "https://github.com/databendlabs/openraft/pull/1274" }],
    "title": "gRPC network and kv-memstore example",
    "date": "2024-12-14",
    "state": "merged",
    "problem": "openraft shipped no gRPC transport example, leaving anyone building on it to infer the whole network layer from the trait definitions. Contributed a working one: gRPC network implementation, in-memory key-value store and a runnable cluster, in nineteen files.",
    "tags": ["rust", "distributed-systems"]
  },
  {
    "repo": "mxsm/rocketmq-rust",
    "prs": [
      { "n": 1651, "url": "https://github.com/mxsm/rocketmq-rust/pull/1651" },
      { "n": 1650, "url": "https://github.com/mxsm/rocketmq-rust/pull/1650" },
      { "n": 1641, "url": "https://github.com/mxsm/rocketmq-rust/pull/1641" },
      { "n": 1636, "url": "https://github.com/mxsm/rocketmq-rust/pull/1636" }
    ],
    "title": "Queue allocation strategies and broker statistics for the Rust client",
    "date": "2024-12-07",
    "state": "merged",
    "problem": "The Rust client was missing allocation strategies the Java client has had for years, which meant consumers could not be placed by machine room. Implemented the machine-room, nearby-machine-room and config-driven AllocateMessageQueueStrategy variants with unit tests, plus the BrokerStatsData protocol types.",
    "tags": ["rust", "distributed-systems"]
  },
  {
    "repo": "tokio-rs/tokio",
    "prs": [{ "n": 6762, "url": "https://github.com/tokio-rs/tokio/pull/6762" }],
    "title": "Mark JoinHandle::abort_handle as must_use",
    "date": "2024-08-09",
    "state": "merged",
    "problem": "Discarding the return value of abort_handle throws away the only handle that can ever abort that task, and the compiler said nothing. One line of annotation turns a silent mistake into a warning at the call site.",
    "tags": ["rust", "async"]
  },
  {
    "repo": "gitui-org/gitui",
    "prs": [{ "n": 2081, "url": "https://github.com/gitui-org/gitui/pull/2081" }],
    "title": "Validate branch names when renaming",
    "date": "2024-02-20",
    "state": "merged",
    "problem": "The rename prompt accepted names git itself would reject, so the error only appeared once the rename was attempted and the typed name was already gone. Moved validation to the prompt.",
    "tags": ["rust", "tui"]
  },
  {
    "repo": "gitui-org/gitui",
    "prs": [{ "n": 1909, "url": "https://github.com/gitui-org/gitui/pull/1909" }],
    "title": "Confirmation dialog before undoing a commit",
    "date": "2023-10-17",
    "state": "merged",
    "problem": "Undo commit fired on a single keystroke with nothing between an accidental press and a discarded commit. Added a confirmation step, matching how the rest of the destructive actions in the UI behave.",
    "tags": ["rust", "tui"]
  },
  {
    "repo": "apache/datafusion",
    "prs": [{ "n": 24973, "url": "https://github.com/apache/datafusion/pull/24973" }],
    "title": "Delegate the remaining ComposedPhysicalExtensionCodec methods",
    "date": "2026-09-06",
    "state": "open",
    "problem": "The composed codec implemented six of its twelve methods and let the rest fall through to defaults, so half of what it was supposed to compose quietly did nothing. Delegating naively is not enough either: the four by-name function hooks default to an empty payload that prost encodes to zero bytes, which strands them at position 0, so those go through a payload-aware encoder instead.",
    "tags": ["rust", "databases"]
  },
  {
    "repo": "rust-lang/rust",
    "prs": [{ "n": 162231, "url": "https://github.com/rust-lang/rust/pull/162231" }],
    "title": "compiletest: error when a filter matches nothing but names a real file",
    "date": "2026-09-03",
    "state": "open",
    "problem": "Running ./x test on a path like a .stderr file runs zero tests and still reports ok, so a filter that silently matched nothing looks exactly like a clean pass. An earlier attempt was blocked by filtering being tied to libtest; that dependency went away when compiletest got its own executor, which is what makes the fix possible now.",
    "tags": ["rust", "tooling"]
  },
  {
    "repo": "vectordotdev/vector",
    "prs": [{ "n": 26265, "url": "https://github.com/vectordotdev/vector/pull/26265" }],
    "title": "Configurable minimum and maximum TLS versions",
    "date": "2026-08-30",
    "state": "open",
    "problem": "Vector's TLS version range is whatever its libraries default to: listeners accept TLS 1.0 and 1.1 and cannot negotiate 1.3 at all, and compliance scanners flag it with no configuration available to fix it. A previous PR proposed changing the default outright and was closed asking for configurability and a deprecation path, so this adds min_tls_version and max_tls_version, both unset by default so nothing changes for existing users.",
    "tags": ["rust", "observability"]
  }
];
