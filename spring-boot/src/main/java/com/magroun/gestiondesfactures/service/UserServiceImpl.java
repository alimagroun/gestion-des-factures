package com.magroun.gestiondesfactures.service;

import com.magroun.gestiondesfactures.dto.SettingsResponse;
import com.magroun.gestiondesfactures.mappers.UserMapper;
import com.magroun.gestiondesfactures.model.User;
import com.magroun.gestiondesfactures.repository.UserRepository;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
	
    private UserRepository userRepository;
    private UserMapper userMapper;
    
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }
    
    @Override
    public SettingsResponse getSettings(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return userMapper.toSettingsResponse(user);
        } else {
            return null;
        }
    }

}
