import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  isNotEmoji,
  isValidUpstreamFormatDate,
} from '../helpers/utilities/utilities.service';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  SafetyAssessmentDecisionUnsafe,
  YesNoEnum,
  YNEnum,
} from '../common/constants/enumerations';
import {
  incidentNumberFieldName,
  safetyAssessmentPayloadFamilyNameMax,
  safetyAssessmentStandardCommentMax,
  safetyDecisionsCommentsMax,
  safetyDecisionsDecisionUnsafeMax,
  safetyDecisionsNarrativeMax,
  upstreamDateFormatNoTime,
} from '../common/constants/upstream-constants';
import { idMaxLength, idRegex } from '../common/constants/parameter-constants';

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentPayloadItem' })
export class SafetyAssessmentPayloadItem {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Incident-Number-Here',
    description: 'The Incident Number.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  @Expose()
  [incidentNumberFieldName]: string;

  @Transform(({ value }) => {
    return isValidUpstreamFormatDate(value);
  })
  @IsNotEmpty()
  @MaxLength(upstreamDateFormatNoTime.length)
  @ApiProperty({
    example: '02/28/2025',
    description:
      'The date of the visit, expected to be provided in ' +
      upstreamDateFormatNoTime +
      ' format. Must not be a future date or time.',
  })
  @Expose()
  dateOfAssessment: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(safetyAssessmentPayloadFamilyNameMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @ApiProperty({
    example: 'Last Name',
    description: 'Contact last name.',
    maxLength: safetyAssessmentPayloadFamilyNameMax,
  })
  @Expose()
  familyName: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentFactorInfluenceItem' })
export class SafetyAssessmentFactorInfluenceItem {
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  ageUptoFive: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  medicalMentalDisorder: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  notReadilyAccessible: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  diminishedMental: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  diminishedPhysical: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentSafetyFactorsItem' })
export class SafetyAssessmentSafetyFactorsItem {
  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  physicalHarm: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  seriousInjuryAbuse: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  fearsMaltreatChild: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  threatAgainstChild: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  excessiveForce: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  subsExposedInfant: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtClarification?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  currentCircumstances: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtCircumstances?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  sexAbuse: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtAbuse?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  unableToProtect: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtProtect?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  injuryExplanation: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtExplanation?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  refuseAccess: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtAccess?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  immediateNeeds: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtNeeds?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  physicalCondition: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtCondition?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  currentAbuse: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtCurrent?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  partnerViolence: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtViolence?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  predominantlyNegative: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtNegative?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  emotionalStability: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtEmotional?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  childFearful: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtFearful?: string;

  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    enum: YesNoEnum,
  })
  otherFactors: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtOtherFactors?: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentProtectiveCapacityItem' })
export class SafetyAssessmentProtectiveCapacityItem {
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  childCognitive: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentCognitive: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentWillingness: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentResources: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentSupportive: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentProtect: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentAccept: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentRelationship: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentAware: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  parentProbSolving: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  noProCapPresent: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  capacitiesOther: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtProtectiveCapacity01: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtProtectiveCapacity02: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentSafetyInterventionsItem' })
export class SafetyAssessmentSafetyInterventionsItem {
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  directIntervention: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  useOfIndividuals: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  useCommAgencies: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  protectVictim: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  leaveHome: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  nonOffendingParent: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  legalIntPlanned: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  otherSafetyInterventions: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyAssessmentStandardCommentMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyAssessmentStandardCommentMax,
  })
  cmtSafetyInterventions?: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  childOutsideHome: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  childRemoved: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentSafetyDecisionsItem' })
export class SafetyAssessmentSafetyDecisionsItem {
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  noSafetyFactors: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  safeInterventions: string;

  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  unsafeSafetyFactors: string;

  @IsOptional()
  @IsEnum(SafetyAssessmentDecisionUnsafe)
  @MaxLength(safetyDecisionsDecisionUnsafeMax)
  @Expose()
  @ApiProperty({
    example: SafetyAssessmentDecisionUnsafe.All,
    enum: SafetyAssessmentDecisionUnsafe,
    maxLength: safetyDecisionsDecisionUnsafeMax,
  })
  decisionUnsafe?: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyDecisionsCommentsMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyDecisionsCommentsMax,
  })
  comments?: string;

  @IsOptional()
  @IsString()
  @MaxLength(safetyDecisionsNarrativeMax)
  @Expose()
  @ApiProperty({
    example: 'Comment here',
    maxLength: safetyDecisionsNarrativeMax,
  })
  narrative?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  readyFinalize?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    return isValidUpstreamFormatDate(value);
  })
  @IsNotEmpty()
  @MaxLength(upstreamDateFormatNoTime.length)
  @ApiProperty({
    example: '02/28/2025',
    description:
      'Expected to be provided in ' +
      upstreamDateFormatNoTime +
      ' format. Must not be a future date or time.',
  })
  @Expose()
  readyFinalizeDate?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    enum: YNEnum,
  })
  approvedFinalize?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    return isValidUpstreamFormatDate(value);
  })
  @IsNotEmpty()
  @MaxLength(upstreamDateFormatNoTime.length)
  @ApiProperty({
    example: '02/28/2025',
    description:
      'Expected to be provided in ' +
      upstreamDateFormatNoTime +
      ' format. Must not be a future date or time.',
  })
  @Expose()
  approvedFinalizeDate?: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentChildsInOutCareItem' })
export class SafetyAssessmentChildsInOutCareItem {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Contact-Id-Here',
    description: `Child's contact row id.`,
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  @Expose()
  childContactId: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentWorkflowDto' })
export class SafetyAssessmentWorkflowDto {
  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentPayloadItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentPayloadItem)
  Payload: Array<SafetyAssessmentPayloadItem>;

  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentFactorInfluenceItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentFactorInfluenceItem)
  factorInfluence: Array<SafetyAssessmentFactorInfluenceItem>;

  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentSafetyFactorsItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentSafetyFactorsItem)
  safetyFactors: Array<SafetyAssessmentSafetyFactorsItem>;

  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentProtectiveCapacityItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentProtectiveCapacityItem)
  protectiveCapacity: Array<SafetyAssessmentProtectiveCapacityItem>;

  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentSafetyInterventionsItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentSafetyInterventionsItem)
  safetyInterventions: Array<SafetyAssessmentSafetyInterventionsItem>;

  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentSafetyDecisionsItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentSafetyDecisionsItem)
  safetyDecisions: Array<SafetyAssessmentSafetyDecisionsItem>;

  @IsOptional()
  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @Expose()
  @ApiProperty({
    type: SafetyAssessmentChildsInOutCareItem,
    isArray: true,
  })
  @Type(() => SafetyAssessmentChildsInOutCareItem)
  childsInOutCare?: Array<SafetyAssessmentChildsInOutCareItem>;

  constructor(object) {
    Object.assign(this, object);
  }
}
