import ChangePasswordForm from '@components/user-profile/change-password';
import DeleteAccountForm from '@components/user-profile/delete-account';
import ImageUploadForm from '@components/user-profile/upload-image';
import UserForm from '@components/user-profile/user-form';

const Profile = () => {
  return (
    <>
      <div>
        <div className="mx-auto max-w-screen-xl">
          <main>
            <div className="divide-y divide-white/5">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-white">Personal Information</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-8">
                    <ImageUploadForm></ImageUploadForm>
                    <UserForm></UserForm>
                  </div>
                </div>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-white">Change password</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Update your password associated with your account.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <ChangePasswordForm></ChangePasswordForm>
                </div>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-white">Delete account</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    No longer want to use our service? You can delete your account here. This action is not reversible.
                    All information related to this account will be deleted permanently.
                  </p>
                </div>

                <div className="flex items-start md:col-span-2">
                  <DeleteAccountForm></DeleteAccountForm>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
