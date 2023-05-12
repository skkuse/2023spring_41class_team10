import React from 'react'
import { Link } from 'react-router-dom'
import { } from '../components'
import { useAuth, useProfileQuery } from '../hooks'

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
            <></>
            ) : ( // 본인 프로필 아닐 경우 변경 못하다록
            <></>
        )}
    </ProfileContainer>
    )
}

export default ProfilePage