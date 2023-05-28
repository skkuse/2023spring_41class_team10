import React from 'react'
import { Link } from 'react-router-dom'
import { } from '../components'
import { useAuth, useProfileQuery } from '../hooks'
import { useEffect } from 'react'
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f2f2;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const ProfileUsername = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProfileGithub = styled.a`
  font-size: 1rem;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;

function ProfilePage() {
    const { data } = useProfileQuery()
    const { authUser } = useAuth()
    const { username, github } = data.profile
    const canUpdateProfile = authUser?.username === username
    const [toast, setToast] = useState(false);
    const copyUrl = async () => {
        await navigator.clipboard.writeText(url); // 링크 복사 부분
        setToast(true);
      };

    React.useEffect(() => {
    setAuthorFilter()
    }, [username, setAuthorFilter])

    return (
    <ProfileContainer>
        <ProfileImage
        src="https://example.com/profile-image.jpg" // Replace with the actual image URL
        alt="Profile Image"
        />
        <ProfileUsername>{username}</ProfileUsername>
        <ProfileGithub href={github} target="_blank" rel="noopener noreferrer">
        Visit GitHub Profile
        </ProfileGithub>
        {canUpdateProfile ? ( // 본인 프로필일 경우, username(닉네임)을 변경할 수 있도록
            <UpdateProfileForm onSubmit={handleUpdateProfile}>
                <UpdateProfileInput
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                placeholder="New Username"
                />
                <UpdateProfileButton type="submit">이름 변경하기</UpdateProfileButton>
            </UpdateProfileForm>
            ) : ( // 본인 프로필 아닐 경우 변경 못하다록
            <p>You can only update your own profile.</p>
        )}
        {toast && (
        <Toast
          setToast={setToast}
          text={
            canUpdateProfile
              ? '프로필이 성공적으로 변경되었습니다!'
              : "잘못된 user입니다."
          }
        />
      )}
    </ProfileContainer>
    )
}
export default ProfilePage
