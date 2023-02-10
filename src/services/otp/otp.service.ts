import type { GenerateOtp, VerifyOtp } from './otp.interface';
import OtpModel from './otp.model';
import OtpVSchema from './otp.validation';

class OtpService {
  private dbModel: typeof OtpModel;
  private vSchema: InstanceType<typeof OtpVSchema>;

  constructor() {
    this.dbModel = OtpModel;
    this.vSchema = new OtpVSchema();
  }
  /**
   * Grnerates and returns a OTP
   * @param `payload`
   * payload = {
   * `userId` :`string`
   * }
   */
  public generateOtp: GenerateOtp = async ({ email }) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expDate = new Date();
    expDate.setMinutes(expDate.getMinutes() + 5);
    const oneTimePwd = {
      code,
      codeExpirationDate: expDate,
      email,
    };
    const body = await this.vSchema.create.parseAsync(oneTimePwd);
    const serverOtp = await this.dbModel.create(body);
    return {
      code: serverOtp.code,
      email: serverOtp.email,
    };
  };

  public reGenerateOtp: GenerateOtp = async ({ email }) => {
    await this.dbModel.deleteMany({ email });
    return this.generateOtp({ email });
  };

  public verifyOtp: VerifyOtp = async ({ otp, email }) => {
    const serverOtp = await this.dbModel.findOne({ email });
    if (!serverOtp) return 'Expired';
    if (serverOtp.codeExpirationDate < new Date(Date.now())) {
      await this.dbModel.findOneAndDelete({ email });
      return 'Expired';
    }
    if (serverOtp.code !== otp) return 'Invalid';

    await this.dbModel.deleteMany({ email });
    return 'Valid';
  };
}

export default OtpService;
