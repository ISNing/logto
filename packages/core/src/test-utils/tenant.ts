import { createMockPool, createMockQueryResult } from 'slonik';

import Libraries from '#src/tenants/Libraries.js';
import Queries from '#src/tenants/Queries.js';
import type TenantContext from '#src/tenants/TenantContext.js';

import type { GrantMock } from './oidc-provider.js';
import { createMockProvider } from './oidc-provider.js';

const { jest } = import.meta;

const pool = createMockPool({
  query: async (sql, values) => {
    return createMockQueryResult([]);
  },
});

// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Partial2<T> = { [key in keyof T]?: Partial<T[key]> };

export class MockTenant implements TenantContext {
  public queries: Queries;
  public libraries: Libraries;

  constructor(
    public provider = createMockProvider(),
    queriesOverride?: Partial2<Queries>,
    librariesOverride?: Partial2<Libraries>
  ) {
    this.queries = new Queries(pool);
    this.setPartial('queries', queriesOverride);
    this.libraries = new Libraries(this.queries);
    this.setPartial('libraries', librariesOverride);
  }

  setPartialKey<Type extends 'queries' | 'libraries', Key extends keyof this[Type]>(
    type: Type,
    key: Key,
    value: Partial<this[Type][Key]>
  ) {
    this[type][key] = { ...this[type][key], ...value };
  }

  setPartial<Type extends 'queries' | 'libraries'>(type: Type, value?: Partial2<this[Type]>) {
    if (!value) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(value) as Array<keyof this[Type]>) {
      this.setPartialKey(type, key, { ...this[type][key], ...value[key] });
    }
  }
}

export const createMockTenantWithInteraction = (
  interactionDetails?: jest.Mock,
  Grant?: typeof GrantMock
) => new MockTenant(createMockProvider(interactionDetails, Grant));