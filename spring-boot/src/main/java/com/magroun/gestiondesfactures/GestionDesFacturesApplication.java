package com.magroun.gestiondesfactures;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GestionDesFacturesApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionDesFacturesApplication.class, args);
	}

}
