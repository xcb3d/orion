// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"contract/gas-station.mdx": () => import("../content/docs/contract/gas-station.mdx?collection=docs"), "contract/overview.mdx": () => import("../content/docs/contract/overview.mdx?collection=docs"), "contract/recovery-module.mdx": () => import("../content/docs/contract/recovery-module.mdx?collection=docs"), "extension/background.mdx": () => import("../content/docs/extension/background.mdx?collection=docs"), "extension/crypto-engine.mdx": () => import("../content/docs/extension/crypto-engine.mdx?collection=docs"), "extension/overview.mdx": () => import("../content/docs/extension/overview.mdx?collection=docs"), "extension/walrus.mdx": () => import("../content/docs/extension/walrus.mdx?collection=docs"), "architecture/authentication.mdx": () => import("../content/docs/architecture/authentication.mdx?collection=docs"), "architecture/overview.mdx": () => import("../content/docs/architecture/overview.mdx?collection=docs"), "architecture/security-model.mdx": () => import("../content/docs/architecture/security-model.mdx?collection=docs"), }),
};
export default browserCollections;