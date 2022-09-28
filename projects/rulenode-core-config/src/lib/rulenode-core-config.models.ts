import { EntitySearchDirection, EntityTypeFilter } from '@shared/public-api';

export enum OriginatorSource {
  CUSTOMER = 'CUSTOMER',
  TENANT = 'TENANT',
  RELATED = 'RELATED',
  ALARM_ORIGINATOR = 'ALARM_ORIGINATOR',
  ENTITY = 'ENTITY'
}

export const originatorSourceTranslations = new Map<OriginatorSource, string>(
  [
    [OriginatorSource.CUSTOMER, 'tb.rulenode.originator-customer'],
    [OriginatorSource.TENANT, 'tb.rulenode.originator-tenant'],
    [OriginatorSource.RELATED, 'tb.rulenode.originator-related'],
    [OriginatorSource.ALARM_ORIGINATOR, 'tb.rulenode.originator-alarm-originator'],
    [OriginatorSource.ENTITY, 'tb.rulenode.originator-entity'],
  ]
);

export enum PerimeterType {
  CIRCLE = 'CIRCLE',
  POLYGON = 'POLYGON'
}

export const perimeterTypeTranslations = new Map<PerimeterType, string>(
  [
    [PerimeterType.CIRCLE, 'tb.rulenode.perimeter-circle'],
    [PerimeterType.POLYGON, 'tb.rulenode.perimeter-polygon'],
  ]
);

export enum TimeUnit {
  MILLISECONDS = 'MILLISECONDS',
  SECONDS = 'SECONDS',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS'
}

export const timeUnitTranslations = new Map<TimeUnit, string>(
  [
    [TimeUnit.MILLISECONDS, 'tb.rulenode.time-unit-milliseconds'],
    [TimeUnit.SECONDS, 'tb.rulenode.time-unit-seconds'],
    [TimeUnit.MINUTES, 'tb.rulenode.time-unit-minutes'],
    [TimeUnit.HOURS, 'tb.rulenode.time-unit-hours'],
    [TimeUnit.DAYS, 'tb.rulenode.time-unit-days']
  ]
);

export enum RangeUnit {
  METER = 'METER',
  KILOMETER = 'KILOMETER',
  FOOT = 'FOOT',
  MILE = 'MILE',
  NAUTICAL_MILE = 'NAUTICAL_MILE'
}

export const rangeUnitTranslations = new Map<RangeUnit, string>(
  [
    [RangeUnit.METER, 'tb.rulenode.range-unit-meter'],
    [RangeUnit.KILOMETER, 'tb.rulenode.range-unit-kilometer'],
    [RangeUnit.FOOT, 'tb.rulenode.range-unit-foot'],
    [RangeUnit.MILE, 'tb.rulenode.range-unit-mile'],
    [RangeUnit.NAUTICAL_MILE, 'tb.rulenode.range-unit-nautical-mile']
  ]
);

export enum EntityDetailsField {
  TITLE = 'TITLE',
  COUNTRY = 'COUNTRY',
  STATE = 'STATE',
  CITY = 'CITY',
  ZIP = 'ZIP',
  ADDRESS = 'ADDRESS',
  ADDRESS2 = 'ADDRESS2',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  ADDITIONAL_INFO = 'ADDITIONAL_INFO'
}

export const entityDetailsTranslations = new Map<EntityDetailsField, string>(
  [
    [EntityDetailsField.TITLE, 'tb.rulenode.entity-details-title'],
    [EntityDetailsField.COUNTRY, 'tb.rulenode.entity-details-country'],
    [EntityDetailsField.STATE, 'tb.rulenode.entity-details-state'],
    [EntityDetailsField.CITY, 'tb.rulenode.entity-details-city'],
    [EntityDetailsField.ZIP, 'tb.rulenode.entity-details-zip'],
    [EntityDetailsField.ADDRESS, 'tb.rulenode.entity-details-address'],
    [EntityDetailsField.ADDRESS2, 'tb.rulenode.entity-details-address2'],
    [EntityDetailsField.PHONE, 'tb.rulenode.entity-details-phone'],
    [EntityDetailsField.EMAIL, 'tb.rulenode.entity-details-email'],
    [EntityDetailsField.ADDITIONAL_INFO, 'tb.rulenode.entity-details-additional_info']
  ]
);

export enum FetchMode {
  FIRST = 'FIRST',
  LAST = 'LAST',
  ALL = 'ALL'
}

export enum SamplingOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SqsQueueType {
  STANDARD = 'STANDARD',
  FIFO = 'FIFO'
}

export const sqsQueueTypeTranslations = new Map<SqsQueueType, string>(
  [
    [SqsQueueType.STANDARD, 'tb.rulenode.sqs-queue-standard'],
    [SqsQueueType.FIFO, 'tb.rulenode.sqs-queue-fifo'],
  ]
);

export type credentialsType = 'anonymous' | 'basic' | 'cert.PEM';
export const credentialsTypes: credentialsType[] = ['anonymous', 'basic', 'cert.PEM'];

export const credentialsTypeTranslations = new Map<credentialsType, string>(
  [
    ['anonymous', 'tb.rulenode.credentials-anonymous'],
    ['basic', 'tb.rulenode.credentials-basic'],
    ['cert.PEM', 'tb.rulenode.credentials-pem']
  ]
);

export type AzureIotHubCredentialsType = 'sas' | 'cert.PEM';
export const azureIotHubCredentialsTypes: AzureIotHubCredentialsType[] = ['sas', 'cert.PEM'];

export const azureIotHubCredentialsTypeTranslations = new Map<AzureIotHubCredentialsType, string>(
  [
    ['sas', 'tb.rulenode.credentials-sas'],
    ['cert.PEM', 'tb.rulenode.credentials-pem']
  ]
);

export enum HttpRequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export const ToByteStandartCharsetTypes = [
  'US-ASCII',
  'ISO-8859-1',
  'UTF-8',
  'UTF-16BE',
  'UTF-16LE',
  'UTF-16'
];

export const ToByteStandartCharsetTypeTranslations = new Map<string, string>(
  [
    ['US-ASCII', 'tb.rulenode.charset-us-ascii'],
    ['ISO-8859-1', 'tb.rulenode.charset-iso-8859-1'],
    ['UTF-8', 'tb.rulenode.charset-utf-8'],
    ['UTF-16BE', 'tb.rulenode.charset-utf-16be'],
    ['UTF-16LE', 'tb.rulenode.charset-utf-16le'],
    ['UTF-16', 'tb.rulenode.charset-utf-16'],
  ]
);

export interface RelationsQuery {
  fetchLastLevelOnly: boolean;
  direction: EntitySearchDirection;
  maxLevel?: number;
  filters?: EntityTypeFilter[];
}

export interface FunctionData {
  value: MathFunction,
  name: string,
  description: string,
  minArgs: number,
  maxArgs: number,
}

export enum MathFunction {
  CUSTOM = 'CUSTOM',
  ADD = 'ADD',
  SUB = 'SUB',
  MULT = 'MULT',
  DIV = 'DIV',
  SIN = 'SIN',
  SINH = 'SINH',
  COS = 'COS',
  COSH = 'COSH',
  TAN = 'TAN',
  TANH = 'TANH',
  ACOS = 'ACOS',
  ASIN = 'ASIN',
  ATAN = 'ATAN',
  ATAN2 = 'ATAN2',
  EXP = 'EXP',
  EXPM1 = 'EXPM1',
  SQRT = 'SQRT',
  CBRT = 'CBRT',
  GET_EXP = 'GET_EXP',
  HYPOT = 'HYPOT',
  LOG = 'LOG',
  LOG10 = 'LOG10',
  LOG1P = 'LOG1P',
  CEIL = 'CEIL',
  FLOOR = 'FLOOR',
  FLOOR_DIV = 'FLOOR_DIV',
  FLOOR_MOD = 'FLOOR_MOD',
  ABS = 'ABS',
  MIN = 'MIN',
  MAX = 'MAX',
  POW = 'POW',
  SIGNUM = 'SIGNUM',
  RAD = 'RAD',
  DEG = 'DEG',
}

export const MathFunctionMap  = new Map<MathFunction, FunctionData>(
  [
    [
      MathFunction.CUSTOM,
      {
        value: MathFunction.CUSTOM,
        name: 'Custom Function',
        description:'You can provide your custom function in your environment',
        minArgs: 1,
        maxArgs: 16
      }
    ],
    [
      MathFunction.ADD,
      {
        value: MathFunction.ADD,
        name: 'Addition',
        description:'Returns the sum of its arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.SUB,
      {
        value: MathFunction.SUB,
        name: 'Subtraction',
        description: 'Returns the difference of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.MULT,
      {
        value: MathFunction.MULT,
        name: 'Multiplication',
        description: 'Returns the product of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.DIV,
      {
        value: MathFunction.DIV,
        name: 'Division',
        description: 'Returns the quotient of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.SIN,
      {
        value: MathFunction.SIN,
        name: 'Sine',
        description: 'Returns the trigonometric sine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.SINH,
      {
        value: MathFunction.SINH,
        name: 'Hyperbolic sine',
        description: 'Returns the hyperbolic sine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.COS,
      {
        value: MathFunction.COS,
        name: 'Cosine',
        description: 'Returns the trigonometric cosine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.COSH,
      {
        value: MathFunction.COSH,
        name: 'Hyperbolic cosine',
        description: 'Returns the hyperbolic cosine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.TAN,
      {
        value: MathFunction.TAN,
        name: 'Tangent',
        description: 'Returns the trigonometric tangent of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.TANH,
      {
        value: MathFunction.TANH,
        name: 'Hyperbolic tangent',
        description: 'Returns the hyperbolic tangent of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.ACOS,
      {
        value: MathFunction.ACOS,
        name: 'Arc cosine',
        description: 'Returns the arc cosine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.ASIN,
      {
        value: MathFunction.ASIN,
        name: 'Arc sine',
        description: 'Returns the arc sine of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.ATAN,
      {
        value: MathFunction.ATAN,
        name: 'Arc tangent',
        description: 'Returns the arc tangent of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.ATAN2,
      {
        value: MathFunction.ATAN2,
        name: 'Arc tangent in radian',
        description: 'Returns the angle theta from the conversion of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.EXP,
      {
        value: MathFunction.EXP,
        name: 'Exponential',
        description: 'Returns Euler\'s number e raised to the power of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.EXPM1,
      {
        value: MathFunction.EXPM1,
        name: 'Exponential minus one',
        description: 'Returns e raised to the power of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.SQRT,
      {
        value: MathFunction.SQRT,
        name: 'Square',
        description: 'Returns the correctly rounded positive square root of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.CBRT,
      {
        value: MathFunction.CBRT,
        name: 'Cube root',
        description: 'Returns the cube root of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.GET_EXP,
      {
        value: MathFunction.GET_EXP,
        name: 'Get exponent',
        description: 'Returns the unbiased exponent used in the representation of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.HYPOT,
      {
        value: MathFunction.HYPOT,
        name: 'Square root',
        description: 'Returns the square root of the squares of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.LOG,
      {
        value: MathFunction.LOG,
        name: 'Logarithm',
        description: 'Returns the natural logarithm of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.LOG10,
      {
        value: MathFunction.LOG10,
        name: 'Base 10 logarithm',
        description: 'Returns the base 10 logarithm of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.LOG1P,
      {
        value: MathFunction.LOG1P,
        name: 'Logarithm of the sum',
        description: 'Returns the natural logarithm of the sum of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.CEIL,
      {
        value: MathFunction.CEIL,
        name: 'Ceiling',
        description: 'Returns the smallest (closest to negative infinity) of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.FLOOR,
      {
        value: MathFunction.FLOOR,
        name: 'Floor',
        description: 'Returns the largest (closest to positive infinity) of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.FLOOR_DIV,
      {
        value: MathFunction.FLOOR_DIV,
        name: 'Floor division',
        description: 'Returns the largest (closest to positive infinity) of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.FLOOR_MOD,
      {
        value: MathFunction.FLOOR_MOD,
        name: 'Floor modulus',
        description: 'Returns the floor modulus of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.ABS,
      {
        value: MathFunction.ABS,
        name: 'Absolute',
        description: 'Returns the absolute value of an argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.MIN,
      {
        value: MathFunction.MIN,
        name: 'Min',
        description: 'Returns the smaller of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.MAX,
      {
        value: MathFunction.MAX,
        name: 'Max',
        description: 'Returns the greater of the arguments',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.POW,
      {
        value: MathFunction.POW,
        name: 'Raise to a power',
        description: 'Returns the value of the first argument raised to the power of the second argument',
        minArgs: 2,
        maxArgs: 2
      }
    ],
    [
      MathFunction.SIGNUM,
      {
        value: MathFunction.SIGNUM,
        name: 'Sign of a real number',
        description: 'Returns the signum function of the argument',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.RAD,
      {
        value: MathFunction.RAD,
        name: 'Radian',
        description: 'Converts an angle measured in degrees to an approximately equivalent angle measured in radians',
        minArgs: 1,
        maxArgs: 1
      }
    ],
    [
      MathFunction.DEG,
      {
        value: MathFunction.DEG,
        name: 'Degrees',
        description: 'Converts an angle measured in radians to an approximately equivalent angle measured in degrees.',
        minArgs: 1,
        maxArgs: 1
      }
    ],
  ]);

export enum ArgumentType {
  ATTRIBUTE = 'ATTRIBUTE',
  TIME_SERIES = 'TIME_SERIES',
  CONSTANT = 'CONSTANT',
  MESSAGE_BODY = 'MESSAGE_BODY',
  MESSAGE_METADATA = 'MESSAGE_METADATA'
}

export enum ArgumentTypeResult {
  ATTRIBUTE = 'ATTRIBUTE',
  TIME_SERIES = 'TIME_SERIES',
  MESSAGE_BODY = 'MESSAGE_BODY',
  MESSAGE_METADATA = 'MESSAGE_METADATA'
}

export const ArgumentTypeMap  = new Map<ArgumentType, string>([
  [ArgumentType.ATTRIBUTE, 'tb.rulenode.attribute-type'],
  [ArgumentType.TIME_SERIES, 'tb.rulenode.time-series-type'],
  [ArgumentType.CONSTANT, 'tb.rulenode.constant-type'],
  [ArgumentType.MESSAGE_BODY, 'tb.rulenode.message-body-type'],
  [ArgumentType.MESSAGE_METADATA, 'tb.rulenode.message-metadata-type']
]);

export const ArgumentName = ['x', 'y', 'z', 'a', 'b', 'c', 'd', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't'];

export enum AttributeScope {
  SHARED_SCOPE = 'SHARED_SCOPE',
  SERVER_SCOPE = 'SERVER_SCOPE',
  CLIENT_SCOPE = 'CLIENT_SCOPE'
}

export enum AttributeScopeResult {
  SHARED_SCOPE = 'SHARED_SCOPE',
  SERVER_SCOPE = 'SERVER_SCOPE'
}

export const AttributeScopeMap  = new Map<AttributeScope, string>([
  [AttributeScope.SHARED_SCOPE, 'tb.rulenode.shared-scope'],
  [AttributeScope.SERVER_SCOPE, 'tb.rulenode.server-scope'],
  [AttributeScope.CLIENT_SCOPE, 'tb.rulenode.client-scope']
]);
