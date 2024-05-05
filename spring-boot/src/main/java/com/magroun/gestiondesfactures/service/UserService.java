package com.magroun.gestiondesfactures.service;

import com.magroun.gestiondesfactures.dto.SettingsResponse;

public interface UserService {
	SettingsResponse getSettings(String email);

}
