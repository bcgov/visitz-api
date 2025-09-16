import { plainToInstance } from 'class-transformer';
import { SafetyAssessmentWorkflowDto } from './workflow-submit-safety-assessment.dto';
import { validateOrReject } from 'class-validator';

describe('SafetyAssessmentWorkflowDto tests', () => {
  it.each([
    [
      {
        Payload: [
          {
            incidentNumber: 'sabifebuiqf',
            dateOfAssessment: '02/15/2025',
            familyName:
              'ycqwjiidvznebnwdkjfwysxtoadtklrrejxdzpptuidtfwrcclbznrtinqksvwbmulracncvxvxasoxrziwffvxuohsvgjtgfusdjlghzvixxsgodkjcgisznbmbxcdrufuyveyuxmfyggjdtfxchwkvuanytstfleflrtdgkzwxhoondlowoxdmdcpgwkbmanunzxdcnwiipzfbtvxfwftqqeabqualtmbumucnwbjrtifffhotmkidoen',
          },
        ],
        factorInfluence: [
          {
            ageUptoFive: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            medicalMentalDisorder: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            notReadilyAccessible: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            diminishedMental: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            diminishedPhysical: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
          },
        ],
        safetyFactors: [
          {
            physicalHarm: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            seriousInjuryAbuse: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            fearsMaltreatChild: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            threatAgainstChild: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            excessiveForce: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            subsExposedInfant: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            currentCircumstances: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            sexAbuse: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            unableToProtect: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            injuryExplanation: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            refuseAccess: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            immediateNeeds: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            physicalCondition: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            currentAbuse: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            partnerViolence: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            predominantlyNegative: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            emotionalStability: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            childFearful: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            otherFactors: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
          },
        ],
        protectiveCapacity: [
          {
            childCognitive: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentCognitive: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentWillingness: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentResources: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentSupportive: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentProtect: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentAccept: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentRelationship: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentAware: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            parentProbSolving: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            noProCapPresent: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            capacitiesOther: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
          },
        ],
        safetyInterventions: [
          {
            directIntervention: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            useOfIndividuals: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            useCommAgencies: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            protectVictim: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            leaveHome: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            nonOffendingParent: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            legalIntPlanned: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            otherSafetyInterventions:
              'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            childOutsideHome: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            childRemoved: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
          },
        ],
        safetyDecisions: [
          {
            noSafetyFactors: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            safeInterventions: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            unsafeSafetyFactors: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            decisionUnsafe: 'Some children placed',
            readyFinalize: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
            approvedFinalize: 'YTqvwufovbprbguprbgup-42m[-i4n2-n-3on-0r3n',
          },
        ],
        childsInOutCare: [
          {
            childContactId: '339827&*()_&9780324097-',
          },
        ],
      },
    ],
  ])(`should fail upon validation errors`, async (input) => {
    const postInPersonVisitDto = plainToInstance(
      SafetyAssessmentWorkflowDto,
      input,
    );
    try {
      await validateOrReject(postInPersonVisitDto);
    } catch (error) {
      console.log(error);
      return;
    }
    fail();
  });
});
