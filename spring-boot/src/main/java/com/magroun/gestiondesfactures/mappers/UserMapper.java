package com.magroun.gestiondesfactures.mappers;

import org.springframework.stereotype.Component;

import com.magroun.gestiondesfactures.dto.SettingsResponse;
import com.magroun.gestiondesfactures.model.User;

@Component
public class UserMapper {
	
    public SettingsResponse toSettingsResponse(User user) {
        SettingsResponse settingsResponse = new SettingsResponse();
        settingsResponse.setStamp(user.getStamp());
        settingsResponse.setTaxPercentage(user.getTaxPercentage());        
        return settingsResponse;
    }

}
