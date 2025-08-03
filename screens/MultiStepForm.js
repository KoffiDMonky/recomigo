import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CategoryStep from "./steps/CategoryStep";
import InfoStep from "./steps/InfoStep";
import SummaryStep from "./steps/SummaryStep";

const steps = [
  { key: "category", label: "Choisis une catégorie", component: CategoryStep },
  { key: "info", label: "Infos", component: InfoStep },
  { key: "summary", label: "Récapitulatif", component: SummaryStep },
];

export default function MultiStepForm({ onFinish, onCancel, initialData = {}, showSaveDeleteButtons = false, onDelete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const CurrentComponent = steps[currentStep].component;

  const handleNext = (data) => {
    const merged = { ...formData, ...data };
    setFormData(merged);
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onFinish(merged);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    onFinish(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{steps[currentStep].label}</Text>
        {showSaveDeleteButtons && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <CurrentComponent
          formData={formData}
          onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
          onNext={handleNext}
          onBack={handleBack}
        />
      </View>

      <View style={styles.buttonBar}>
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]} 
          onPress={() => {
            if (currentStep < steps.length - 1) {
              handleNext(formData);
            } else {
              onFinish(formData);
            }
          }}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < steps.length - 1 ? 'Suivant' : 'Valider'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10,
    height: "100%",
  },
  stepHeader: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stepTitle: { 
    fontSize: 22, 
    fontWeight: "bold",
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 10,
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: "#E0E0E0",
  },
  backButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
