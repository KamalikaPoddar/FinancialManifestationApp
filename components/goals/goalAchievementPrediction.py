import tensorflow as tf
import numpy as np

class GoalAchievementPredictor:
    def __init__(self):
        self.model = self.build_model()
    
    def build_model(self):
        model = tf.keras.Sequential([
            # Input layer with multiple features
            tf.keras.layers.Dense(64, activation='relu', input_shape=(10,)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),
            
            # Hidden layers
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            
            # Output layer - probability of goal achievement
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def train(self, training_data, labels):
        # Normalize input features
        normalized_data = self.normalize_data(training_data)
        
        # Train the model
        history = self.model.fit(
            normalized_data, 
            labels, 
            epochs=100,
            validation_split=0.2,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(patience=10),
                tf.keras.callbacks.ReduceLROnPlateau(patience=5)
            ]
        )
        
        return history
    
    def predict_goal_achievement(self, user_data):
        # Prepare input features
        normalized_data = self.normalize_data(user_data)
        
        # Make prediction
        prediction = self.model.predict(normalized_data)
        
        return prediction[0][0]
